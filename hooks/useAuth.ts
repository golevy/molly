import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthModal from "store/useAuthModal";

export const useAuth = () => {
  const { data: session, status } = useSession();
  const { isOpen, toggleModal } = useAuthModal();
  const router = useRouter();

  useEffect(() => {
    const protectRoutes = async () => {
      if (status === "loading") return;

      if (!session) {
        await router.push("/");

        if (!isOpen) {
          toggleModal(true);
        }
      }
    };

    protectRoutes();
  }, [session, status, isOpen, router, toggleModal]);
};
