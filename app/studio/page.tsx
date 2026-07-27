"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudioTopBar } from "@/components/studio/studio-top-bar";
import { useStudioAuth } from "@/components/studio/auth-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { Carousel } from "@/lib/studio/types";

export default function StudioHomePage() {
  const { session, loading: authLoading } = useStudioAuth();
  const router = useRouter();

  const [items, setItems] = useState<Carousel[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 로그인 안 했으면 로그인 화면으로.
  useEffect(() => {
    if (!authLoading && !session) {
      router.replace("/studio/login");
    }
  }, [authLoading, session, router]);

  const load = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    const supabase = getSupabaseBrowserClient();
    const { data, error: fetchError } = await supabase
      .from("carousels")
      .select("*")
      .order("updated_at", { ascending: false });
    if (fetchError) {
      setError("작업 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
    } else {
      setItems((data ?? []) as Carousel[]);
    }
    setLoading(false);
  }, [session]);

  useEffect(() => {
    if (session) load();
  }, [session, load]);

  async function handleCreate() {
    if (!session) return;
    setCreating(true);
    setError(null);
    const supabase = getSupabaseBrowserClient();
    const { data, error: insertError } = await supabase
      .from("carousels")
      .insert({ user_id: session.user.id })
      .select()
      .single();
    setCreating(false);
    if (insertError || !data) {
      setError("새로 만들지 못했어요. 잠시 후 다시 시도해 주세요.");
      return;
    }
    router.push(`/studio/${(data as Carousel).id}`);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("이 카드뉴스를 지울까요? 되돌릴 수 없어요.")) return;
    const supabase = getSupabaseBrowserClient();
    // 낙관적 제거(먼저 화면에서 지우고, 실패하면 되돌린다)
    const prev = items;
    setItems((cur) => cur.filter((c) => c.id !== id));
    const { error: delError } = await supabase
      .from("carousels")
      .delete()
      .eq("id", id);
    if (delError) {
      setItems(prev);
      setError("삭제하지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
  }

  if (authLoading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        불러오는 중…
      </div>
    );
  }

  return (
    <>
      <StudioTopBar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              내 카드뉴스
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              만든 작업은 자동으로 저장돼요.
            </p>
          </div>
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            새로 만들기
          </Button>
        </div>

        {error ? (
          <p className="mb-4 text-sm text-destructive">{error}</p>
        ) : null}

        {loading ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            불러오는 중…
          </p>
        ) : items.length === 0 ? (
          <EmptyState onCreate={handleCreate} creating={creating} />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="group relative rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/50"
              >
                <Link href={`/studio/${item.id}`} className="block">
                  <p className="pr-8 text-base font-medium text-foreground">
                    {item.title || "제목 없는 카드뉴스"}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    슬라이드 {item.slides?.length ?? 0}장 · 수정{" "}
                    {formatDate(item.updated_at)}
                  </p>
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  aria-label="삭제"
                  className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}

function EmptyState({
  onCreate,
  creating,
}: {
  onCreate: () => void;
  creating: boolean;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border py-16 text-center">
      <p className="text-sm text-muted-foreground">아직 만든 카드뉴스가 없어요.</p>
      <div className="mt-4">
        <Button onClick={onCreate} disabled={creating}>
          <Plus className="h-4 w-4" />첫 카드뉴스 만들기
        </Button>
      </div>
    </div>
  );
}

// "2026. 7. 27." 같은 짧은 날짜
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
