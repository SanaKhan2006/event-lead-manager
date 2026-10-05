from pydantic import BaseModel


class LeadCreate(BaseModel):
    name: str
    company: str
    email: str
    event: str
    notes: str
    follow_up_status: str