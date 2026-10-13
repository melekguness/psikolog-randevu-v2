import {
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  Navigate,
  type NavigateProps,
  type To,
} from "react-router-dom";

export {
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  Navigate,
};

export function usePathname() {
  return useLocation().pathname;
}

export function useRouter() {
  const navigate = useNavigate();
  return {
    push: (to: To) => navigate(to),
    replace: (to: To) => navigate(to, { replace: true }),
    back: () => navigate(-1),
    prefetch: (_to?: To) => undefined,
  };
}

/** Helper for redirect routes. */
export function Redirect({ to, replace = true }: { to: To; replace?: boolean }) {
  return <Navigate to={to} replace={replace} />;
}

export type { NavigateProps, To };
