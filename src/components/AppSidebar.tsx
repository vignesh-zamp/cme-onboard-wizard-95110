import { Menu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { OnboardingState } from "@/types/onboarding";

interface AppSidebarProps {
  state: OnboardingState;
}

export function AppSidebar({ state }: AppSidebarProps) {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border p-6">
        {open ? (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">
              CME Onboarding
            </h2>
            <p className="text-sm text-muted-foreground">powered by Pace</p>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Menu className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="p-6">
        {open && <ProgressIndicator state={state} />}
      </SidebarContent>
    </Sidebar>
  );
}
