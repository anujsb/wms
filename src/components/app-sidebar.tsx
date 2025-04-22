// // import {
// //   Calendar,
// //   Home,
// //   Inbox,
// //   // Link,
// //   Plus,
// //   Search,
// //   Settings,
// // } from "lucide-react";

// // import {
// //   Sidebar,
// //   SidebarContent,
// //   SidebarGroup,
// //   SidebarGroupAction,
// //   SidebarGroupContent,
// //   SidebarGroupLabel,
// //   SidebarMenu,
// //   SidebarMenuButton,
// //   SidebarMenuItem,
// // } from "@/components/ui/sidebar";
// // import Link from "next/link";

// // import { WMSRepository } from "@/lib/Repository";

// // export async function AppSidebar() {
// //   const repo = new WMSRepository();
// //   const projects = await repo.getProjects();
// //   return (
// //     <Sidebar>
// //       <SidebarContent>
// //         <h1>hi</h1>
// //         <SidebarGroup>
// //           <SidebarGroupLabel>
// //             {/* <Link href="/projects"> */}
// //             Your Projects
// //             {/* </Link> */}
// //           </SidebarGroupLabel>
// //           <SidebarGroupAction title="Add Project">
// //             <Link href="/projects/new">
// //               <Plus /> <span className="sr-only">Add Project</span>
// //             </Link>
// //           </SidebarGroupAction>
// //           <SidebarGroupContent>
// //             <SidebarMenu>
// //               {projects.map((project) => (
// //                 <SidebarMenuItem key={project.name}>
// //                   <SidebarMenuButton asChild>
// //                     <a href={`/projects/${project.id}`}>
// //                       {/* <item.icon /> */}
// //                       <span>{project.name}</span>
// //                     </a>
// //                   </SidebarMenuButton>
// //                 </SidebarMenuItem>
// //               ))}
// //             </SidebarMenu>
// //           </SidebarGroupContent>
// //         </SidebarGroup>
// //       </SidebarContent>
// //     </Sidebar>
// //   );
// // }

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Plus,
  Briefcase,
  Code,
  FileText,
  Folder,
  Globe,
  Layout,
  Lightbulb,
  Package,
  Rocket,
  Star,
  Settings, // Replaced 'Tool' with 'Settings'
  Zap,
  PlusCircle,
} from "lucide-react";

import { WMSRepository } from "@/lib/Repository";

// Function to get an icon based on project name
function getProjectIcon(projectName: string) {
  // Use the first letter to select an icon
  const firstLetter = projectName.charAt(0).toLowerCase();

  // Map letters to icons
  // const iconMap: Record<string, typeof Star> = {
  //   a: Rocket,
  //   b: Briefcase,
  //   c: Code,
  //   d: FileText,
  //   e: Zap,
  //   f: Folder,
  //   g: Globe,
  //   h: Layout,
  //   i: Star,
  //   j: Lightbulb,
  //   k: Settings, // Changed from Tool to Settings
  //   l: Package,
  //   m: Rocket,
  //   n: Briefcase,
  //   o: Code,
  //   p: FileText,
  //   q: Zap,
  //   r: Folder,
  //   s: Globe,
  //   t: Layout,
  //   u: Star,
  //   v: Lightbulb,
  //   w: Settings, // Changed from Tool to Settings
  //   x: Package,
  //   y: Rocket,
  //   z: Briefcase
  // };

  const iconMap: Record<string, typeof Star> = {
    a: Rocket,
    b: Package,
    c: Code,
    d: FileText,
    e: Zap,
    f: FileText,
    g: Layout,
    h: Star,
    i: Code,
    j: Settings,
    k: Rocket,
    l: Package,
    m: FileText,
    n: Layout,
    o: Star,
    p: Code,
    q: Zap,
    r: Settings,
    s: Rocket,
    t: Package,
    u: FileText,
    v: Layout,
    w: Star,
    x: Code,
    y: Zap,
    z: Settings,
  };

  // Return the mapped icon or a default icon if not found
  return iconMap[firstLetter] || Star;
}

// Function to generate a color based on project name
function getProjectColor(projectName: string): string {
  // Simple hash function to generate a number from the project name
  let hash = 0;
  for (let i = 0; i < projectName.length; i++) {
    hash = projectName.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert to hex color
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }

  return color;
}

export async function AppSidebar() {
  const repo = new WMSRepository();
  const projects = await repo.getProjects();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarContent>
        {/* <h1>hi</h1> */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Link href="/projects">Your Projects</Link>
          </SidebarGroupLabel>
          <SidebarGroupAction title="Add Project">
            <Link href="/projects/new">
              <Plus /> <span className="sr-only">Add Project</span>
            </Link>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => {
                const ProjectIcon = getProjectIcon(project.name);
                const iconColor = getProjectColor(project.name);

                return (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton asChild>
                      <a
                        href={`/projects/${project.id}`}
                        className="flex items-center gap-2"
                      >
                        <ProjectIcon size={18} style={{ color: iconColor }} />
                        <span>{project.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupAction,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar";
// import Link from "next/link";
// import { Plus } from "lucide-react";

// import { WMSRepository } from "@/lib/Repository";

// // Function to generate a color based on project name
// function getProjectColor(projectName: string): string {
//   // Simple hash function to generate a number from the project name
//   let hash = 0;
//   for (let i = 0; i < projectName.length; i++) {
//     hash = projectName.charCodeAt(i) + ((hash << 5) - hash);
//   }

//   // Convert to hex color
//   let color = '#';
//   for (let i = 0; i < 3; i++) {
//     const value = (hash >> (i * 8)) & 0xFF;
//     color += ('00' + value.toString(16)).substr(-2);
//   }

//   return color;
// }

// // Function to get a contrasting text color (black or white) based on background color
// function getContrastColor(hexColor: string): string {
//   // Remove the # if it exists
//   const hex = hexColor.replace('#', '');

//   // Convert hex to RGB
//   const r = parseInt(hex.substr(0, 2), 16);
//   const g = parseInt(hex.substr(2, 2), 16);
//   const b = parseInt(hex.substr(4, 2), 16);

//   // Calculate luminance - bright colors have white text, dark colors have black text
//   const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
//   return luminance > 0.5 ? '#000000' : '#ffffff';
// }

// export async function AppSidebar() {
//   const repo = new WMSRepository();
//   const projects = await repo.getProjects();

//   return (
//     <Sidebar collapsible="icon" variant="floating">
//       <SidebarContent>
//         {/* <h1>hi</h1> */}
//         <SidebarGroup>
//           <SidebarGroupLabel>
//             Your Projects
//           </SidebarGroupLabel>
//           <SidebarGroupAction title="Add Project">
//             <Link href="/projects/new">
//               <Plus /> <span className="sr-only">Add Project</span>
//             </Link>
//           </SidebarGroupAction>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {projects.map((project) => {
//                 const bgColor = getProjectColor(project.name);
//                 const textColor = getContrastColor(bgColor);
//                 const firstLetter = project.name.charAt(0).toUpperCase();

//                 return (
//                   <SidebarMenuItem key={project.name}>
//                     <SidebarMenuButton asChild>
//                       <a href={`/projects/${project.id}`} className="flex items-center gap-2">
//                         {/* First letter avatar */}
//                         <div
//                           className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
//                           style={{ backgroundColor: bgColor, color: textColor }}
//                         >
//                           {firstLetter}
//                         </div>
//                         <span>{project.name}</span>
//                       </a>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 );
//               })}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   );
// }
