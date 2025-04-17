// import { NextResponse } from 'next/server';
// import { Repository } from '@/lib/Repository';

// const repository = new Repository();

// export async function GET(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = parseInt(params.id);
//     const user = await repository.getUserById(id);
//     if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     return NextResponse.json(user);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
//   }
// }

// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = parseInt(params.id);
//     const body = await request.json();
//     const updatedUser = await repository.updateUser(id, body);
//     if (!updatedUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     return NextResponse.json(updatedUser);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Failed to update user' }, { status: 400 });
//   }
// }

// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = parseInt(params.id);
//     const deleted = await repository.deleteUser(id);
//     if (!deleted) return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     return NextResponse.json({ message: 'User deleted' });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import { Repository } from '@/lib/Repository';

// Initialize the Repository instance for database operations
const repository = new Repository();

/**
 * GET: Fetch a specific project by its ID
 * @param request - The incoming HTTP request
 * @param params - Route parameters containing the project ID
 * @returns JSON response with the project data or an error message
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Parse the project ID from the URL parameters
    const id = parseInt(params.id);

    // Retrieve the project from the database using the Repository
    const project = await repository.getProjectById(id);

    // Check if the project exists
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Return the project data
    return NextResponse.json(project);
  } catch (error) {
    // Log and return error for server-side issues
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

/**
 * PUT: Update a specific project by its ID
 * @param request - The incoming HTTP request with updated project data
 * @param params - Route parameters containing the project ID
 * @returns JSON response with the updated project data or an error message
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Parse the project ID from the URL parameters
    const id = parseInt(params.id);

    // Parse the request body for updated project data
    const body = await request.json();

    // Update the project in the database using the Repository
    const updatedProject = await repository.updateProject(id, body);

    // Check if the project was found and updated
    if (!updatedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Return the updated project data
    return NextResponse.json(updatedProject);
  } catch (error) {
    // Log and return error for invalid data or server-side issues
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 400 }
    );
  }
}

/**
 * DELETE: Delete a specific project by its ID
 * @param request - The incoming HTTP request
 * @param params - Route parameters containing the project ID
 * @returns JSON response confirming deletion or an error message
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Parse the project ID from the URL parameters
    const id = parseInt(params.id);

    // Delete the project from the database using the Repository
    const deleted = await repository.deleteProject(id);

    // Check if the project was found and deleted
    if (!deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Confirm successful deletion
    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    // Log and return error for server-side issues
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}