import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SwitchComponenet from "@/components/switch";
import { FC } from "@/types/settingsComponent";
import { IconForms } from "@tabler/icons-react";
import { useRecoilState } from "recoil";
import { workspacestate } from "@/state";

type Props = {
  triggerToast: typeof toast;
};

const Forms: FC<Props> = ({ triggerToast }) => {
  const [workspace, setWorkspace] = useRecoilState(workspacestate);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const workspaceGroupId = workspace.groupId;
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/forms/status?workspaceGroupId=${workspaceGroupId}`);
        const json = await res.json();
        if (json.success) {
          setEnabled(json.data.enabled);
        } else {
          triggerToast.error(json.error || "Failed to load forms status");
        }
      } catch {
        triggerToast.error("Failed to load forms status");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [workspaceGroupId]);
  const toggle = async () => {
    const newValue = !enabled;
    setEnabled(newValue);
    try {
      const res = await fetch(`/api/forms/status?workspaceGroupId=${workspaceGroupId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enabled: newValue }),
      });
      const json = await res.json();
      if (!json.success) {
        setEnabled(!newValue);
        triggerToast.error(json.error || "Failed to update forms status");
        return;
      }
      triggerToast.success("Forms updated");
    } catch {
      setEnabled(!newValue);
      triggerToast.error("Failed to update forms status");
    }
  };

  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <IconForms size={18} className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-white">
            Forms
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Create, customize, and manage workspace forms for collecting structured data, submissions, and user input across your workspace
          </p>
        </div>
      </div>
      <SwitchComponenet
        checked={enabled}
        label=""
        classoverride="mt-0"
        onChange={toggle}
        disabled={loading}
      />
    </div>
  );
};

Forms.title = "Forms";

export default Forms;