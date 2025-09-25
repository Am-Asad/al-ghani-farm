"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type QueryConfig<TParams extends Record<string, string>> = {
  defaults: TParams;
  // Optional: validate/coerce the final params read from URL
  normalize?: (params: TParams) => TParams;
  // Keys that should reset page when they change
  pageKey?: keyof TParams;
};

function buildFrom<TParams extends Record<string, string>>(
  searchParams: URLSearchParams,
  defaults: TParams
): TParams {
  const base: Record<string, string> = { ...defaults };
  Object.keys(defaults).forEach((key) => {
    const val = searchParams.get(key);
    if (val !== null) base[key] = val;
  });
  return base as TParams;
}

export const useQueryParams = <TParams extends Record<string, string>>(
  config: QueryConfig<TParams>
) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    const parsed = buildFrom(
      new URLSearchParams(searchParams),
      config.defaults
    );
    return config.normalize ? config.normalize(parsed) : parsed;
  }, [config, searchParams]);

  const setParams = useCallback(
    (updates: Partial<TParams>, options?: { replace?: boolean }) => {
      const current = new URLSearchParams(searchParams);

      const next: TParams = {
        ...buildFrom(current, config.defaults),
        ...(updates as TParams),
      };

      Object.entries(next).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "")
          current.delete(key);
        else current.set(key, value);
      });

      const url = `${pathname}?${current.toString()}`;
      if (options?.replace !== false) router.replace(url);
      else router.push(url);
    },
    [pathname, router, searchParams, config.defaults]
  );

  const reset = useCallback(() => {
    const next = new URLSearchParams();
    Object.entries(config.defaults).forEach(([key, value]) => {
      if (value !== "") next.set(key, value);
    });
    const url = `${pathname}?${next.toString()}`;
    router.replace(url);
  }, [config.defaults, pathname, router]);

  return { params, setParams, reset } as const;
};
