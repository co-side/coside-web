interface MockFileSystemHandle {
  isSameEntry(other: FileSystemHandle): boolean;
  queryPermission(options?: { writable?: boolean }): Promise<PermissionState>;
  requestPermission(options?: { writable?: boolean }): Promise<PermissionState>;
}

interface MockFileSystemFileHandle extends MockFileSystemHandle {
  kind: "file" | "directory";
  name: string;
  createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>;
  getFile(): Promise<File>;
  move(destination: FileSystemHandle): Promise<void>;
  remove(): Promise<void>;
}

function createFileSystemFileHandle(file: File): MockFileSystemFileHandle {
  return {
    kind: "file",
    name: file.name,
    createWritable: () => {
      throw new Error("Writable streams are not supported in this mock implementation");
    },
    getFile: () => Promise.resolve(file),
    move: () => {
      throw new Error("Move operation is not supported in this mock implementation");
    },
    remove: () => {
      throw new Error("Remove operation is not supported in this mock implementation");
    },
    isSameEntry: () => {
      return false;
    },
    queryPermission: () => {
      return Promise.reject(new Error("Permission query not supported in this mock implementation"))
    },
    requestPermission: () => {
      return Promise.reject(new Error("Permission request not supported in this mock implementation"));
    },
  }
}

type FilePickerAcceptType = {
  description?: string;
  accept: Record<string, string[]>;
};

interface InputFilePickerOptions {
  multiple?: boolean;
  types?: FilePickerAcceptType[];
}

export function showOpenFilePicker(options: InputFilePickerOptions = {}): Promise<MockFileSystemFileHandle[] | FileSystemFileHandle[]> {
  if (typeof window !== "undefined" && "showOpenFilePicker" in window) {
    return (window as any).showOpenFilePicker(options);
  }
  let input: HTMLInputElement | null;
  return new Promise<MockFileSystemFileHandle[]>((resolve, reject) => {
    input = document.createElement("input");
    input.type = "file";

    if (options.multiple) {
      input.multiple = true;
    }

    // 處理 accept type
    if (options.types && options.types.length > 0) {
      const acceptList = options.types
        .map(type =>
          Object.keys(type.accept)
            .map(mime => type.accept[mime])
            .flat()
        )
        .flat();
      input.accept = acceptList.join(",");
    }

    input.style.display = "none";
    document.body.appendChild(input);

    input.addEventListener("change", () => {
      if (input?.files) {
        resolve(Array.from(input.files).map(createFileSystemFileHandle));
      } else {
        reject(new Error("No file selected"));
      }
    });

    input.addEventListener("cancel", () => {
      reject(new Error("File selection was cancelled"));
    });

    input.click();
  })
  .finally(() => {
    if (input) {
      document.body.removeChild(input);
    }
  });
}
