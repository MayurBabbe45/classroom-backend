import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import express from "express";
import { subjects, departments } from "../db/schema";
import { db } from "../db";

const router = express.Router();

// Get all subjects with optional search filtering and pagination
router.get("/", async (req, res) => {
  try {
    const { search, department, page = 1, limit = 10 } = req.query;

    const currentPage = Math.max(1, parseInt(String(page),10)||1);
    const limitPerPage = Math.min(Math.max(1, parseInt(String(limit),10)||10), 100);

    const offset = (currentPage - 1) * limitPerPage;
    const filterConditions = [];

    //If search query exist, filter by subject name OR subject code
    if (search) {
      filterConditions.push(
        or(
          ilike(subjects.name, `%${search}%`),
          ilike(subjects.code, `%${search}%`),
        ),
      );
    }

    if (department) {
      const deptPattern = `%${String(department).replace(/[%_]/g, '\\$&')}%`;
      filterConditions.push(ilike(departments.name, deptPattern));
    }

    //combine all filters using AND if exist
    const whereConditions =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    let countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id));
    if (whereConditions) countQuery = countQuery.where(whereConditions);
    const countResult = await countQuery;

    const totalCount = Number(countResult[0]?.count ?? 0);
    let subjectsQuery = db
      .select({
        ...getTableColumns(subjects),
        department: { ...getTableColumns(departments) },
      })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id));
    if (whereConditions) subjectsQuery = subjectsQuery.where(whereConditions);
    const subjectsList = await subjectsQuery
      .orderBy(desc(subjects.createdAt))
      .limit(limitPerPage)
      .offset(offset);

      res.status(200).json({
        data:subjectsList,
        pagination :{
          total: totalCount,
          page: currentPage,
          limit: limitPerPage,
          totalPages : Math.ceil(totalCount / limitPerPage)
        }
      })
  } catch (e) {
    console.error(`Get /subjects error ${e} `);
    res.status(500).json({ error: "Failed to get subjects" });
  }
});


export default router;