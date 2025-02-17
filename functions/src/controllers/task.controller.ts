import { TaskService } from "../services/task.service";
import { Request, Response } from "express";

export class TaskController {
  private taskService: TaskService;

  constructor(taskService: TaskService) {
    this.taskService = taskService;
  }

  public getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;      
      const uid = req.headers["uid"] as string;

      const result = await this.taskService.getTasks(page, limit, uid);
      res.status(200).json(result);
    } catch (error) {
      console.error( "Error en getAllTasks:", (error as Error).message );
      res.status(500).json({ message: "Error al obtener las tareas" });
    }
  };

  public createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { Titulo, Descripcion, Estado, uid } = req.body;

      await this.taskService.createTask({
        Titulo,
        Descripcion,
        Estado,
        Usuario: uid,
      });
      res.status(201).json({ message: "Tarea creada exitosamente" });
    } catch (error) {
      console.error( "Error en createTask:", (error as Error).message );
      res.status(400).json({ message: (error as Error).message });
    }
  };

  public updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { taskId } = req.params;
      const { Titulo, Descripcion } = req.body;

      if (!taskId) {
        res.status(400).json({ message: "El ID de la tarea es obligatorio" });
        return;
      }

      await this.taskService.updateTask(taskId, { Titulo, Descripcion });
      res.status(200).json({ message: "Tarea actualizada exitosamente" });
    } catch (error) {
      console.error( "Error en updateTask:", (error as Error).message );
      res.status(400).json({ message: (error as Error).message });
    }
  };

  public deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { taskId } = req.params;

      if (!taskId) {
        res.status(400).json({ message: "El ID de la tarea es obligatorio" });
        return;
      }

      await this.taskService.deleteTask(taskId);
      res.status(200).json({ message: "Tarea eliminada exitosamente" });
    } catch (error) {
      console.error( "Error en deleteTask", (error as Error).message );
      res.status(400).json({ message: (error as Error).message });
    }
  };

  public completeTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const { taskIds } = req.body;

      if (!Array.isArray(taskIds) || taskIds.length === 0) {
        res.status(400).json({ message: "Se requiere una lista de IDs de tareas" });
      }

      await this.taskService.completeTasks(taskIds);
      res.status(200).json({ message: "Tareas marcadas como completadas exitosamente" });
    } catch (error) {
      console.error( "Error en completeTasks:", (error as Error).message );
      res.status(400).json({ message: (error as Error).message });
    }
  };
}
