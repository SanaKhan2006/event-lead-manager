from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import Lead
from schemas import LeadCreate
from database import engine, Base
from sqlalchemy.orm import Session
from ai_service import generate_followup
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://event-lead-manager-frontend.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


# Home
@app.get("/")
def home():
    return {"message": "Hello from Event Lead Manager"}


# CREATE - Add a new lead
@app.post("/leads")
def create_lead(lead: LeadCreate):
    db = Session(bind=engine)

    new_lead = Lead(
        name=lead.name,
        company=lead.company,
        email=lead.email,
        event=lead.event,
        notes=lead.notes,
        follow_up_status=lead.follow_up_status
    )

    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)
    db.close()

    return {
        "message": "Lead created successfully",
        "lead": new_lead
    }


# READ - Get all leads
@app.get("/leads")
def get_leads():
    db = Session(bind=engine)

    leads = db.query(Lead).all()

    db.close()

    return leads

@app.get("/leads/search")
def search_leads(
    search: str = "",
    status: str = ""
):
    db = Session(bind=engine)

    query = db.query(Lead)

    if search:
        query = query.filter(
            (Lead.name.ilike(f"%{search}%")) |
            (Lead.company.ilike(f"%{search}%")) |
            (Lead.event.ilike(f"%{search}%"))
        )

    if status:
        query = query.filter(Lead.follow_up_status == status)

    leads = query.all()

    db.close()

    return leads

# READ - Get one lead by ID
@app.get("/leads/{lead_id}")
def get_lead(lead_id: int):
    db = Session(bind=engine)

    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    db.close()

    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    return lead


# UPDATE - Edit a lead
@app.put("/leads/{lead_id}")
def update_lead(lead_id: int, updated_lead: LeadCreate):
    db = Session(bind=engine)

    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        db.close()
        raise HTTPException(status_code=404, detail="Lead not found")

    lead.name = updated_lead.name
    lead.company = updated_lead.company
    lead.email = updated_lead.email
    lead.event = updated_lead.event
    lead.notes = updated_lead.notes
    lead.follow_up_status = updated_lead.follow_up_status

    db.commit()
    db.refresh(lead)
    db.close()

    return {
        "message": "Lead updated successfully",
        "lead": lead
    }


# DELETE - Delete a lead
@app.delete("/leads/{lead_id}")
def delete_lead(lead_id: int):
    db = Session(bind=engine)

    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        db.close()
        raise HTTPException(status_code=404, detail="Lead not found")

    db.delete(lead)
    db.commit()
    db.close()

    return {
        "message": "Lead deleted successfully"
    }

@app.post("/ai/followup")
def create_followup(lead: LeadCreate):
    try:
        message = generate_followup(
            lead.name,
            lead.company,
            lead.event,
            lead.notes
        )

        return {
            "followup": message
        }

    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail="AI service is temporarily unavailable. Please try again."
        )
