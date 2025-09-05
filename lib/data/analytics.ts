import { prisma } from "@/lib/prisma";

export async function getFieldPopularityOverTime(startDate: Date, endDate: Date) {
  try {
    const fieldPopularity = await prisma.fieldViewLog.groupBy({
      by: ['fieldId'],
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        fieldId: true,
      },
      orderBy: {
        _count: {
          fieldId: 'desc',
        },
      },
    });

    // Optionally, fetch field names
    const fieldIds = fieldPopularity.map(item => item.fieldId);
    const fields = await prisma.fields.findMany({
      where: {
        id: {
          in: fieldIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const fieldMap = new Map(fields.map(field => [field.id, field.name]));

    return fieldPopularity.map(item => ({
      fieldId: item.fieldId,
      fieldName: fieldMap.get(item.fieldId) || 'Unknown Field',
      views: item._count.fieldId,
    }));

  } catch (error) {
    console.error("Error fetching field popularity over time:", error);
    return [];
  }
}

export async function getTopActiveModules(limit: number = 5, startDate?: Date, endDate?: Date) {
  try {
    const whereClause: any = {};
    if (startDate && endDate) {
      whereClause.timestamp = {
        gte: startDate,
        lte: endDate,
      };
    }

    const moduleActivity = await prisma.moduleViewLog.groupBy({
      by: ['moduleId'],
      where: whereClause,
      _count: {
        moduleId: true,
      },
      orderBy: {
        _count: {
          moduleId: 'desc',
        },
      },
      take: limit,
    });

    const moduleIds = moduleActivity.map(item => item.moduleId);
    const modules = await prisma.module.findMany({
      where: {
        id: {
          in: moduleIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const moduleMap = new Map(modules.map(module => [module.id, module.name]));

    return moduleActivity.map(item => ({
      moduleId: item.moduleId,
      moduleName: moduleMap.get(item.moduleId) || 'Unknown Module',
      views: item._count.moduleId,
    }));

  } catch (error) {
    console.error("Error fetching top active modules:", error);
    return [];
  }
}

export async function getResourceTypeUsage(startDate?: Date, endDate?: Date) {
  try {
    const whereClause: any = {};
    if (startDate && endDate) {
      whereClause.timestamp = {
        gte: startDate,
        lte: endDate,
      };
    }

    const downloadLogs = await prisma.downloadLog.findMany({
      where: whereClause,
      include: {
        resource: {
          select: {
            type: true,
          },
        },
      },
    });

    const typeCounts = downloadLogs.reduce((acc, log) => {
      const type = log.resource.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
    }));

  } catch (error) {
    console.error("Error fetching resource type usage:", error);
    return [];
  }
}

export async function getSearchTrends(limit: number = 10, startDate?: Date, endDate?: Date) {
  try {
    const whereClause: any = {};
    if (startDate && endDate) {
      whereClause.timestamp = {
        gte: startDate,
        lte: endDate,
      };
    }

    const searchTrends = await prisma.searchLog.groupBy({
      by: ['query'],
      where: whereClause,
      _count: {
        query: true,
      },
      orderBy: {
        _count: {
          query: 'desc',
        },
      },
      take: limit,
    });

    return searchTrends.map(item => ({
      query: item.query,
      count: item._count.query,
    }));

  } catch (error) {
    console.error("Error fetching search trends:", error);
    return [];
  }
}

export async function getInactiveModulesOrFields(periodInDays: number = 90, type: 'module' | 'field') {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - periodInDays);

    if (type === 'module') {
      const activeModuleLogs = await prisma.moduleViewLog.findMany({
        where: {
          timestamp: {
            gte: cutoffDate,
          },
        },
        select: {
          moduleId: true,
        },
        distinct: ['moduleId'],
      });

      const activeModuleIds = new Set(activeModuleLogs.map(log => log.moduleId));

      const allModules = await prisma.module.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      const inactiveModules = allModules.filter(module => !activeModuleIds.has(module.id));

      return inactiveModules.map(module => ({
        id: module.id,
        name: module.name,
        type: 'module',
      }));

    } else if (type === 'field') {
      const activeFieldLogs = await prisma.fieldViewLog.findMany({
        where: {
          timestamp: {
            gte: cutoffDate,
          },
        },
        select: {
          fieldId: true,
        },
        distinct: ['fieldId'],
      });

      const activeFieldIds = new Set(activeFieldLogs.map(log => log.fieldId));

      const allFields = await prisma.fields.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      const inactiveFields = allFields.filter(field => !activeFieldIds.has(field.id));

      return inactiveFields.map(field => ({
        id: field.id,
        name: field.name,
        type: 'field',
      }));
    }

    return [];

  } catch (error) {
    console.error(`Error fetching inactive ${type}s:`, error);
    return [];
  }
}

export async function getUserEngagementHeatmap(startDate?: Date, endDate?: Date) {
  try {
    const whereClause: any = {};
    if (startDate && endDate) {
      whereClause.timestamp = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [searchLogs, downloadLogs, fieldViewLogs, moduleViewLogs] = await Promise.all([
      prisma.searchLog.findMany({ where: whereClause, select: { timestamp: true } }),
      prisma.downloadLog.findMany({ where: whereClause, select: { timestamp: true } }),
      prisma.fieldViewLog.findMany({ where: whereClause, select: { timestamp: true } }),
      prisma.moduleViewLog.findMany({ where: whereClause, select: { timestamp: true } }),
    ]);

    const allLogs = [...searchLogs, ...downloadLogs, ...fieldViewLogs, ...moduleViewLogs];

    // Initialize heatmap structure (7 days x 24 hours)
    const heatmap: { [day: string]: { [hour: string]: number } } = {};
    for (let i = 0; i < 7; i++) {
      heatmap[i.toString()] = {};
      for (let j = 0; j < 24; j++) {
        heatmap[i.toString()][j.toString()] = 0;
      }
    }

    allLogs.forEach(log => {
      const date = new Date(log.timestamp);
      const dayOfWeek = date.getDay(); // Sunday - Saturday : 0 - 6
      const hourOfDay = date.getHours();
      heatmap[dayOfWeek.toString()][hourOfDay.toString()]++;
    });

    return heatmap;

  } catch (error) {
    console.error("Error fetching user engagement heatmap:", error);
    return {};
  }
}
