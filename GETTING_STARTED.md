# Getting Started with AsmBI

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Installation

1. Navigate to the project directory:
```bash
cd AsmBI
```

2. Install root dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

4. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

## Running the Application

### Development Mode

Start both frontend and backend:
```bash
npm run dev
```

Or start them separately:

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

### Access Points

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

## Quick Test

1. Open http://localhost:3001
2. Navigate to "Upload Data"
3. Upload the sample file: `sample_data/sales_data.csv`
4. Go to "Data Model" to view the schema
5. Go to "Report Builder" to create queries
6. Create a dashboard in "Dashboards"

## Sample Query

After uploading data, try this in the Report Builder:
- Select dataset: sales_data
- Measures: SUM(Sales), AVG(Profit)
- Group By: Region
- Chart Type: Bar

## MIPS Engine

The MIPS analytics engine runs automatically. When MARS simulator is not available, it falls back to JavaScript execution with identical results.

To enable native MIPS:
1. Download MARS from http://courses.missouristate.edu/kenvollmar/mars/
2. Place `mars.jar` in the `mips/` directory
3. Ensure Java is installed

## Project Structure

```
AsmBI/
├── frontend/          # Next.js UI
├── backend/           # Node.js API
├── mips/              # MIPS assembly code
├── docs/              # Documentation
└── sample_data/       # Test datasets
```
