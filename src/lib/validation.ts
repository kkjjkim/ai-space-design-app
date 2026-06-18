import { z } from "zod";
import { LEAD_STATUSES } from "./constants";

// 공개 상담 신청 폼 스키마
export const leadCreateSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요.").max(50),
  phone: z
    .string()
    .trim()
    .min(8, "연락처를 정확히 입력해주세요.")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "연락처 형식이 올바르지 않습니다."),
  region: z.string().trim().max(100).optional().or(z.literal("")),
  buildingType: z.string().trim().max(30).optional().or(z.literal("")),
  areaPyeong: z.coerce.number().int().min(1).max(10000).optional().nullable(),
  budget: z.string().trim().max(50).optional().or(z.literal("")),
  desiredDate: z.string().trim().max(50).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  source: z.string().trim().max(30).optional().or(z.literal("")),
  agree: z.literal(true, {
    errorMap: () => ({ message: "개인정보 수집·이용에 동의해주세요." }),
  }),
});

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;

// 관리자 리드 수정 스키마
export const leadUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  memo: z.string().max(2000).optional(),
});
