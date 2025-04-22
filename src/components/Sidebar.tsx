
// import { WMSRepository } from '@/lib/Repository';
// import Link from 'next/link';

// export default async function Sidebar() {
//   const repo = new WMSRepository();
//   const projects = await repo.getProjects();

//   return (
//     <div className="w-64 bg-gray-800 text-white h-full p-4 shadow-lg">
//       <h2 className="text-xl font-bold mb-4">Projects</h2>
//       <ul className="space-y-2">
//         {projects.map((project) => (
//           <li key={project.id}>
//             <Link href={`/projects/${project.id}`} className="block p-2 hover:bg-gray-700 rounded">
//               {project.name}
//             </Link>
//           </li>
//         ))}
//       </ul>
//       <Link href="/projects/new" className="block mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//         New Project
//       </Link>
//     </div>
//   );
// }