from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class OverviewStats(BaseModel):
    total_applications: int
    pending_applications: int
    approved_applications: int
    rejected_applications: int
    total_institutions: int
    active_obligations: int
    overdue_obligations: int
    sla_compliance_rate: float
    system_uptime: str = "99.98%"

class ProgramTypeDistribution(BaseModel):
    name: str
    count: int
    percentage: float
    color: str

class RegionDistribution(BaseModel):
    region: str
    count: int
    pending: int
    approved: int

class OfficerWorkloadItem(BaseModel):
    officer_id: str
    officer_name: str
    active_cases: int
    capacity: int = 60
    utilization_pct: float

