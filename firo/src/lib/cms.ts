/**
 * Builds the value of the data-mdlfy-cms attribute that makes a database text value
 * editable in place: <table>:<row id>:<column>.
 */
export const cms = (table: 'projects' | 'posts', id: string, column: string): string => `${table}:${id}:${column}`
