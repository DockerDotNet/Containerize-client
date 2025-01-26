/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { notification } from "antd";
import {
  killContainer,
  restartContainer,
  startContainer,
  stopContainer,
  //   killContainer,
  //   pauseContainer,
  //   resumeContainer,
  //   removeContainer,
  //   recreateContainer,
  //   editContainer,
} from "@/app/containers/api";
import { ContainerDetail } from "@/app/containers/types";

const useContainerActions = (containerId: string, onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [containerState, setContainerState] = useState<ContainerDetail | null>(
    null
  );
  const isStartDisabled = containerState?.State?.Status === "running";
  const isStopDisabled = containerState?.State?.Status !== "running";
  const isRestartDisabled = false; // Restart is always enabled
  const isKillDisabled = containerState?.State?.Status !== "running";
  const isPauseDisabled = containerState?.State?.Status !== "running";
  const isResumeDisabled = containerState?.State?.Status !== "paused";
  const isRemoveDisabled = false; // Remove is always enabled
  const isRecreateDisabled = false; // Recreate is always enabled
  const isEditDisabled = false; // Edit is always enabled


  const handleAction = async (
    action: () => Promise<any>,
    actionName: string
  ) => {
    setLoadingAction(actionName);
    setIsLoading(true);
    try {
      const response = await action();

      if (response === true) {
        sendNotfication(
          `${actionName} Successful`,
          `Container ${actionName.toLowerCase()} action completed successfully.`,
          "success"
        );
      } else {
        console.error(`${actionName} failed:`, response);
        sendNotfication(
          `${actionName} Failed`,
          `Container ${actionName.toLowerCase()} action failed. Please try again.`,
          "error"
        );
      }

      if (onSuccess) onSuccess(); // Refresh data or perform other actions on success
    } catch (error) {
      console.error(`${actionName} failed:`, error);
      sendNotfication(
        `${actionName} Failed`,
        `Container ${actionName.toLowerCase()} action failed. Please try again.`,
        "error"
      );
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const sendNotfication = (
    message: string,
    description: string,
    type: string
  ) => {
    if (type === "success") {
      notification.success({
        message: message,
        description: description,
        placement: "bottomRight",
      });
    }
    if (type === "error") {
      notification.error({
        message: message,
        description: description,
        placement: "bottomRight",
      });
    }
  };

  const handleStart = async () => {
    await handleAction(() => startContainer(containerId), "Start");
  };

  const handleStop = async () => {
    await handleAction(() => stopContainer(containerId), "Stop");
  };

  const handleRestart = async () => {
    await handleAction(() => restartContainer(containerId), "Restart");
  };

  const handleKill = async () => {
    await handleAction(() => killContainer(containerId), "Kill");
  };

  //   const handlePause = async () => {
  //     await handleAction(() => pauseContainer(containerId), 'Pause');
  //   };

  //   const handleResume = async () => {
  //     await handleAction(() => resumeContainer(containerId), 'Resume');
  //   };

  //   const handleRemove = async () => {
  //     await handleAction(() => removeContainer(containerId), 'Remove');
  //   };

  //   const handleRecreate = async () => {
  //     await handleAction(() => recreateContainer(containerId), 'Recreate');
  //   };

  //   const handleEdit = async () => {
  //     await handleAction(() => editContainer(containerId), 'Edit');
  //   };

  return {
    isLoading,
    loadingAction,
    containerState,
    setContainerState,
    handleStart,
    handleStop,
    handleRestart,
    handleKill,
    // handlePause,
    // handleResume,
    // handleRemove,
    // handleRecreate,
    // handleEdit,
    isStartDisabled,
    isStopDisabled,
    isRestartDisabled,
    isKillDisabled,
    isPauseDisabled,
    isResumeDisabled,
    isRemoveDisabled,
    isRecreateDisabled,
    isEditDisabled,
  };
};

export default useContainerActions;
