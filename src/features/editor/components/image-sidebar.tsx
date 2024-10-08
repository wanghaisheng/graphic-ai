import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSideBarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetImages } from "@/features/images/api/use-get-images";
import { AlertTriangle, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UploadButton } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";

interface ImageSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ImageSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ImageSidebarProps) => {
  const { data, isLoading, isError } = useGetImages();

  const value = editor?.getActiveFontFamily();
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "images" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Images"
        description="Add images to your design"
      />

      <div className="p-4 border-b">
        <UploadButton
          appearance={{
            button: "w-full text-sm font-medium",
            allowedContent: "hidden",
          }}
          content={{
            button: "Upload Image",
          }}
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            editor?.addImage(res[0].url);
          }}
        />
      </div>

      {/* Testing adding video elements  */}

      {/* <div>
        <Button
         onClick={()=>{
          editor?.addVideo("https://cdn.pixabay.com/video/2024/03/04/202982-919365848_large.mp4")
         }}
        >
          Add a video
        </Button>
      </div> */}

      {isLoading && (
        <div className=" flex items-center justify-center flex-1">
          <Loader className="size-4 text-muted-foreground animate-spin" />
        </div>
      )}

      {isError && (
        <div className=" flex flex-col gap-y-4 items-center justify-center flex-1">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className=" text-muted-foreground text-xs">
            Failed to load images
          </p>
        </div>
      )}
      <ScrollArea>
        <div className=" p-4">
          <div className="grid grid-cols-2 gap-4">
            {data?.map((image) => {
              return (
                <button
                  key={image.id}
                  className="w-full relative h-[100px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
                  onClick={() => {
                    editor?.addImage(image.urls.regular);
                  }}
                >
                  <Image
                    src={image.urls.thumb}
                    fill
                    alt={image.alt_description || "Unsplash Image"}
                    className="object-cover"
                  />
                  <Link
                    target="_blank"
                    href={image.links.html}
                    className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50 text-left"
                  >
                    {image.user.name} on Unsplash
                  </Link>
                </button>
              );
            })}
          </div>
        </div>
      </ScrollArea>
      <ToolSideBarClose onClick={onClose} />
    </aside>
  );
};
