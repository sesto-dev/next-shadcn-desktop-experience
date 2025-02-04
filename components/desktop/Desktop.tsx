"use client";

import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ClipboardProvider } from "@/context/ClipboardContext";
import { toast } from "sonner";

import AppSidebar from "@/components/desktop/Sidebar";
import { DragDropArea } from "@/components/desktop/DragAndDropArea";
import { ItemModal } from "@/components/desktop/ItemModal";
import { DraggableWindow } from "@/components/desktop/DraggableWindow";
import { EmptySpaceContextMenu } from "@/components/desktop/EmptySpaceContextMenu";
import DotPattern from "../ui/dot-pattern";
import { cn } from "@/lib/utils";
import { useDesktop } from "@/hooks/useDesktop";
import { initialItems } from "@/config/desktop";

const DesktopWrapper: React.FC = () => {
  const {
    items,
    windows,
    modalState,
    desktopRef,
    moveItem,
    openWindow,
    closeWindow,
    minimizeWindow,
    moveWindow,
    setModalState,
    handleItemOperation,
    deleteItem,
    handleDragStart,
    handleDragEnd,
    handlePaste,
  } = useDesktop(initialItems);

  const handleCreateFile = (parentId?: string | null) => {
    setModalState({
      open: true,
      type: "new",
      itemType: "file",
      parentId: parentId || null,
      item: null,
    });
  };

  const handleCreateFolder = (parentId?: string | null) => {
    setModalState({
      open: true,
      type: "new",
      itemType: "folder",
      parentId: parentId || null,
      item: null,
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <ClipboardProvider>
        <div ref={desktopRef} className="flex h-screen w-screen">
          <AppSidebar items={items} />
          <EmptySpaceContextMenu
            onCreateFile={handleCreateFile}
            onCreateFolder={handleCreateFolder}
          >
            <div className="relative p-2 w-full h-full bg-background md:shadow-xl">
              <DotPattern
                className={cn(
                  "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
                )}
              />

              <DragDropArea
                items={items.filter((item) => item.parentId === null)}
                moveItem={moveItem}
                openWindow={openWindow}
                setModalState={setModalState}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                deleteItem={deleteItem}
                parentPath="/desktop"
              />

              {windows.map((windowItem) => (
                <DraggableWindow
                  key={windowItem.id}
                  windowItem={windowItem}
                  closeWindow={closeWindow}
                  minimizeWindow={minimizeWindow}
                  moveWindow={moveWindow}
                >
                  <EmptySpaceContextMenu
                    parentId={windowItem.item.id}
                    onCreateFile={handleCreateFile}
                    onCreateFolder={handleCreateFolder}
                  >
                    <DragDropArea
                      items={windowItem.item.content || []}
                      moveItem={moveItem}
                      openWindow={openWindow}
                      setModalState={setModalState}
                      parentId={windowItem.item.id}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      deleteItem={deleteItem}
                      parentPath={windowItem.item.path}
                    />
                  </EmptySpaceContextMenu>
                </DraggableWindow>
              ))}

              <ItemModal
                modalState={modalState}
                setModalState={setModalState}
                handleItemOperation={handleItemOperation}
              />
            </div>
          </EmptySpaceContextMenu>
        </div>
      </ClipboardProvider>
    </DndProvider>
  );
};

export default DesktopWrapper;
