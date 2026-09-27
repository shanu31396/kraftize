import { NextResponse } from "next/server";
import { AppError } from "./errors";
import { ZodError } from "zod";

type ApiHandler = (req: Request, context?: any) => Promise<NextResponse> | NextResponse;

export function withErrorHandler(handler: ApiHandler) {
  return async (req: Request, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error: any) {
      console.error(`[API Error] ${req.method} ${req.url}:`, error);

      if (error instanceof AppError) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: error.statusCode }
        );
      }

      if (error instanceof ZodError) {
        return NextResponse.json(
          { success: false, error: "Validation failed", details: error.issues },
          { status: 400 }
        );
      }

      // Unhandled exceptions fallback
      return NextResponse.json(
        { success: false, error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}