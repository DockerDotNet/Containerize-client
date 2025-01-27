/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
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

  const { Status } = containerState?.State || {};


  const {
    isStartDisabled,
    isStopDisabled,
    isRestartDisabled,
    isKillDisabled,
    isPauseDisabled,
    isResumeDisabled,
    isRemoveDisabled,
    isRecreateDisabled,
    isEditDisabled
  } = useMemo(() => {
    const { Status } = containerState?.State || {};
    return {
      isStartDisabled: Status === "running",
      isStopDisabled: Status !== "running",
      isRestartDisabled: false, // Restart is always enabled
      isKillDisabled: Status !== "running",
      isPauseDisabled: Status !== "running",
      isResumeDisabled: Status !== "paused",
      isRemoveDisabled: false, // Remove is always enabled
      isRecreateDisabled: false, // Recreate is always enabled
      isEditDisabled: false, // Edit is always enabled
    };
  }, [containerState]);


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
