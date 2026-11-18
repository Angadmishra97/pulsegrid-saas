// client/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { PlusCircle, LayoutDashboard, LogOut } from 'lucide-react';

export default function Dashboard({ onLogout }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // New Project Modal States & Handler
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject._id);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects');
      setProjects(res.data);
      if (res.data.length > 0) setSelectedProject(res.data[0]);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const res = await API.get(`/tasks/project/${projectId}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const res = await API.post('/projects', {
        name: newProjectName,
        description: newProjectDesc
      });
      setProjects([...projects, res.data]);
      setSelectedProject(res.data);
      setNewProjectName('');
      setNewProjectDesc('');
      setIsProjectModalOpen(false);
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedProject) return;

    try {
      await API.post('/tasks', {
        title: newTaskTitle,
        projectId: selectedProject._id,
        priority: 'Medium',
        status: 'Backlog'
      });
      setNewTaskTitle('');
      fetchTasks(selectedProject._id);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks(selectedProject._id);
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const columns = ['Backlog', 'InProgress', 'Review', 'Done'];

  return (
    <div className="flex h-screen bg-[#0b0f19] text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-[#0f172a]/50 backdrop-blur-md p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <LayoutDashboard className="w-7 h-7 text-indigo-400" />
            <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              PulseGrid SaaS
            </span>
          </div>

          {/* Sidebar Project Section Update */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Projects</span>
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="text-indigo-400 hover:text-indigo-300 text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" /> New
              </button>
            </div>
            <div className="space-y-1">
              {projects.map((proj) => (
                <button
                  key={proj._id}
                  onClick={() => setSelectedProject(proj)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    selectedProject?._id === proj._id
                      ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  {proj.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm transition pt-4 border-t border-slate-800 cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-800 bg-[#0f172a]/30 backdrop-blur-md px-8 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-200">
            {selectedProject ? selectedProject.name : 'Select a Project'}
          </h1>
          <form onSubmit={handleCreateTask} className="flex gap-2">
            <input
              type="text"
              placeholder="New task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="bg-slate-900/60 border border-slate-700/60 rounded-lg px-4 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Add Task
            </button>
          </form>
        </header>

        {/* Kanban Board Grid */}
        <div className="flex-1 overflow-x-auto p-8 grid grid-cols-4 gap-6">
          {columns.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col);
            return (
              <div
                key={col}
                className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex flex-col h-full backdrop-blur-sm"
              >
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
                  <span className="font-medium text-sm text-slate-300">{col}</span>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3">
                  {columnTasks.map((task) => (
                    <div
                      key={task._id}
                      className="bg-[#1e293b]/70 border border-slate-700/50 rounded-lg p-3 shadow-md hover:border-indigo-500/40 transition group"
                    >
                      <p className="text-sm font-medium text-slate-200 mb-2">{task.title}</p>
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span className={`px-2 py-0.5 rounded ${
                          task.priority === 'Urgent' ? 'bg-red-500/20 text-red-400' :
                          task.priority === 'High' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {task.priority}
                        </span>
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          className="bg-slate-800 text-slate-300 border border-slate-700 rounded px-1 py-0.5 text-xs focus:outline-none cursor-pointer"
                        >
                          <option value="Backlog">Backlog</option>
                          <option value="InProgress">In Progress</option>
                          <option value="Review">Review</option>
                          <option value="Done">Done</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Project Creation Modal Overlay */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Mobile App Redesign"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
                <textarea
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Brief overview of project objectives..."
                  rows="3"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}