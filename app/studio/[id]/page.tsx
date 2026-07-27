"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StudioTopBar } from "@/components/studio/studio-top-bar";
import { useStudioAuth } from "@/components/studio/auth-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { emptySlide, type Carousel, type Slide } from "@/lib/studio/types";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function CarouselEditorPage() {
  const { session, loading: authLoading } = useStudioAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [title, setTitle] = useState("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "notfound">(
    "loading"
  );
  const [status, setStatus] = useState<SaveStatus>("idle");

  // 처음 불러온 직후에는 자동저장을 건너뛰기 위한 표시.
  const hydratedRef = useRef(false);

  // 로그인 가드
  useEffect(() => {
    if (!authLoading && !session) {
      router.replace("/studio/login");
    }
  }, [authLoading, session, router]);

  // 작업물 불러오기
  useEffect(() => {
    if (!session || !id) return;
    let alive = true;
    (async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("carousels")
        .select("*")
        .eq("id", id)
        .single();
      if (!alive) return;
      if (error || !data) {
        setLoadState("notfound");
        return;
      }
      const carousel = data as Carousel;
      setTitle(carousel.title ?? "");
      setSlides(
        Array.isArray(carousel.slides) && carousel.slides.length > 0
          ? carousel.slides
          : [emptySlide()]
      );
      setLoadState("ready");
      // 다음 렌더부터 자동저장 활성화
      hydratedRef.current = true;
    })();
    return () => {
      alive = false;
    };
  }, [session, id]);

  const save = useCallback(async () => {
    if (!id) return;
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase
      .from("carousels")
      .update({
        title,
        slides,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    setStatus(error ? "error" : "saved");
  }, [id, title, slides]);

  // 자동저장: 입력이 멈추고 0.8초 뒤에 저장한다.
  useEffect(() => {
    if (!hydratedRef.current) return;
    setStatus("saving");
    const timer = setTimeout(() => {
      save();
    }, 800);
    return () => clearTimeout(timer);
  }, [title, slides, save]);

  // 슬라이드 편집 도우미
  function updateSlide(index: number, patch: Partial<Slide>) {
    setSlides((cur) =>
      cur.map((s, i) => (i === index ? { ...s, ...patch } : s))
    );
  }
  function addSlide() {
    setSlides((cur) => [...cur, emptySlide()]);
  }
  function deleteSlide(index: number) {
    setSlides((cur) =>
      cur.length <= 1 ? cur : cur.filter((_, i) => i !== index)
    );
  }
  function moveSlide(index: number, dir: -1 | 1) {
    setSlides((cur) => {
      const next = [...cur];
      const target = index + dir;
      if (target < 0 || target >= next.length) return cur;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  if (authLoading || !session || loadState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        불러오는 중…
      </div>
    );
  }

  if (loadState === "notfound") {
    return (
      <>
        <StudioTopBar />
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <p className="text-sm text-muted-foreground">
            찾을 수 없는 작업물이에요.
          </p>
          <div className="mt-4">
            <Button onClick={() => router.push("/studio")}>내 작업으로</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <StudioTopBar />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {/* 상단: 뒤로 + 저장 상태 */}
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link
            href="/studio"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            내 작업으로
          </Link>
          <SaveIndicator status={status} />
        </div>

        {/* 제목 */}
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="카드뉴스 제목 (예: 우리 가게 오픈 안내)"
          className="mb-6 h-14 border-0 bg-transparent px-0 text-2xl font-semibold shadow-none focus-visible:ring-0"
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_minmax(280px,340px)]">
          {/* 왼쪽: 슬라이드 편집 */}
          <div className="space-y-4">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="rounded-lg border border-border bg-card p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    슬라이드 {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-1">
                    <IconButton
                      label="위로"
                      onClick={() => moveSlide(index, -1)}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      label="아래로"
                      onClick={() => moveSlide(index, 1)}
                      disabled={index === slides.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      label="슬라이드 삭제"
                      onClick={() => deleteSlide(index)}
                      disabled={slides.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
                <Input
                  value={slide.heading}
                  onChange={(e) =>
                    updateSlide(index, { heading: e.target.value })
                  }
                  placeholder="큰 제목"
                  className="mb-2"
                />
                <Textarea
                  value={slide.body}
                  onChange={(e) => updateSlide(index, { body: e.target.value })}
                  placeholder="설명 문구"
                />
              </div>
            ))}

            <Button variant="outline" className="w-full" onClick={addSlide}>
              <Plus className="h-4 w-4" />
              슬라이드 추가
            </Button>
          </div>

          {/* 오른쪽: 미리보기 */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              미리보기
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
              {slides.map((slide, index) => (
                <SlidePreview key={slide.id} slide={slide} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  const map: Record<SaveStatus, string> = {
    idle: "",
    saving: "저장 중…",
    saved: "저장됨",
    error: "저장 실패 — 인터넷 연결을 확인하세요",
  };
  const text = map[status];
  if (!text) return null;
  return (
    <span
      className={
        status === "error"
          ? "text-sm text-destructive"
          : "text-sm text-muted-foreground"
      }
    >
      {text}
    </span>
  );
}

function IconButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

// 정사각형(인스타 카드) 느낌의 간단 미리보기.
// 다음 단계에서 색·이미지·폰트를 실제 디자인으로 넓힌다.
function SlidePreview({ slide, index }: { slide: Slide; index: number }) {
  return (
    <div className="aspect-square w-40 shrink-0 overflow-hidden rounded-lg border border-border bg-foreground p-5 text-background lg:w-full">
      <div className="flex h-full flex-col">
        <span className="text-[10px] uppercase tracking-widest text-background/60">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="mt-auto space-y-1.5">
          <p className="line-clamp-3 text-base font-semibold leading-snug">
            {slide.heading || "큰 제목"}
          </p>
          {slide.body ? (
            <p className="line-clamp-3 text-xs leading-relaxed text-background/75">
              {slide.body}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
