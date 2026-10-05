import { useProfileInfoState } from "./useProfileInfoState";
import { useProfileEmailChangeState } from "./useProfileEmailChangeState";
import { useProfilePasswordState } from "./useProfilePasswordState";

export function useProfilePage() {
  const infoState = useProfileInfoState();
  const passwordState = useProfilePasswordState();
  const emailChangeState = useProfileEmailChangeState({
    getInitialEmail: () => infoState.profile?.email || "",
    onRequested: async (response) => {
      await infoState.loadProfile();
      return response;
    },
  });

  return {
    ...infoState,
    ...passwordState,
    ...emailChangeState,
  };
}
