// "use client";

// import Image from "next/image";
// import { Trash2 } from "lucide-react";
// import { CSS } from "@dnd-kit/utilities";
// import { useSortable } from "@dnd-kit/sortable";

// interface SortablePhotoProps {
//   id: string;
//   image: string;
//   index: number;
//   isCover: boolean;
//   onDelete: () => void;
//   onPreview: () => void;
// }

// export default function SortablePhoto({
//   id,
//   image,
//   isCover,
//   onDelete,
//   onPreview,
// }: SortablePhotoProps) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({
//     id,
//   });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.6 : 1,
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       {...listeners}
//       className="group relative aspect-square cursor-grab overflow-hidden rounded-2xl border bg-muted active:cursor-grabbing"
//     >
//       <Image
//         src={image}
//         alt="Listing photo"
//         fill
//         sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 25vw"
//         className="object-cover transition-transform duration-300 group-hover:scale-105"
//         onClick={onPreview}
//       />

//       {/* Cover Badge */}
//       {isCover && (
//         <div className="absolute left-3 bottom-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
//           Cover
//         </div>
//       )}

//       {/* Delete Button */}
//       <button
//         onClick={(e) => {
//           e.stopPropagation();
//           onDelete();
//         }}
//         className="
//           absolute left-3 top-3
//           flex h-9 w-9 items-center justify-center
//           rounded-full bg-white/90 shadow-md
//           opacity-0 transition-all
//           hover:bg-red-500 hover:text-white
//           group-hover:opacity-100
//         "
//       >
//         <Trash2 className="h-4 w-4" />
//       </button>

//       {/* Hover Overlay */}
//       <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
//     </div>
//   );
// }