import { ForgotPasswordDialog } from "../../components/auth/ForgotPasswordDialog";
import { PageHeader } from "../../components/common/PageHeader";
import { ProfileEmailChangeDialog } from "../../components/profile/ProfileEmailChangeDialog";
import { ProfileEmailChangeNoticeDialog } from "../../components/profile/ProfileEmailChangeNoticeDialog";
import { ProfileInfoCard } from "../../components/profile/ProfileInfoCard";
import { ProfileSecurityCard } from "../../components/profile/ProfileSecurityCard";
import { useProfilePage } from "../../hooks/profile/useProfilePage";

export function ProfilePage() {
  const pageState = useProfilePage();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Akun Saya"
        seoPath="/admin/profile"
        description="Kelola informasi profil dan keamanan akun Anda."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <ProfileInfoCard
          loading={pageState.loading}
          editing={pageState.editing}
          saving={pageState.saving}
          error={pageState.error}
          profile={pageState.profile}
          form={pageState.form}
          onOpenEmailChange={() => pageState.handleEmailDialogOpenChange(true)}
          onEdit={() => pageState.setEditing(true)}
          onCancel={pageState.cancelProfileEdit}
          onNameChange={(value) => pageState.setForm((previous) => ({ ...previous, name: value }))}
          onSubmit={pageState.handleProfileSubmit}
          onReload={() => pageState.loadProfile()}
        />

        <ProfileSecurityCard
          editing={pageState.editingPassword}
          loading={pageState.passwordLoading}
          currentPassword={pageState.currentPassword}
          newPassword={pageState.newPassword}
          onEdit={() => pageState.setEditingPassword(true)}
          onCancel={pageState.cancelPasswordEdit}
          onCurrentPasswordChange={pageState.setCurrentPassword}
          onNewPasswordChange={pageState.setNewPassword}
          onOpenForgotPassword={() => pageState.setForgotPasswordOpen(true)}
          onSubmit={pageState.handlePasswordSubmit}
        />
      </div>

      <ForgotPasswordDialog
        open={pageState.forgotPasswordOpen}
        onOpenChange={pageState.setForgotPasswordOpen}
        initialEmail={pageState.profile?.email || ""}
      />

      <ProfileEmailChangeDialog
        open={pageState.emailDialogOpen}
        onOpenChange={pageState.handleEmailDialogOpenChange}
        currentEmail={pageState.profile?.email || ""}
        newEmail={pageState.newEmail}
        currentPassword={pageState.emailChangeCurrentPassword}
        loading={pageState.emailChangeLoading}
        onNewEmailChange={pageState.setNewEmail}
        onCurrentPasswordChange={pageState.setEmailChangeCurrentPassword}
        onSubmit={pageState.handleEmailChangeSubmit}
      />

      <ProfileEmailChangeNoticeDialog
        open={pageState.emailChangeNoticeOpen}
        onOpenChange={pageState.setEmailChangeNoticeOpen}
        currentEmail={pageState.requestedCurrentEmail}
        newEmail={pageState.requestedNewEmail}
      />
    </div>
  );
}
