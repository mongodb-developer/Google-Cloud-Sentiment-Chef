import {
  Directive,
  HostBinding,
  HostListener,
  Output,
  EventEmitter
} from "@angular/core";
import { FileHandle, FileHandleService } from "./file-handle.service";

@Directive({
  selector: "[appDrag]"
})
export class DragAndDropDirective {
  @Output() files: EventEmitter<FileHandle[]> = new EventEmitter();

  @HostBinding("style.background") private background = "#eee";

  constructor(private fileHandleService: FileHandleService) { }

  @HostListener("dragover", ["$event"]) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#999";
  }

  @HostListener("dragleave", ["$event"]) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#eee";
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
  
    let files: FileHandle[] = [];
    const filesFromEvent = evt?.dataTransfer?.files;
    if (!filesFromEvent?.length) {
      return;
    }

    for (let i = 0; i < filesFromEvent?.length; i++) {
      const file = filesFromEvent[i];
      const handle = this.fileHandleService.sanitizeFile(file);
      files.push(handle);
    }
    if (files.length > 0) {
      this.files.emit(files);
    }
  }
}
