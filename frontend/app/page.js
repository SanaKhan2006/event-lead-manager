"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [leads, setLeads] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [searchResultsVisible, setSearchResultsVisible] = useState(false);

  const [followups, setFollowups] = useState({});
  const [loadingAI, setLoadingAI] = useState(null);

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    event: "",
    notes: "",
    follow_up_status: "Pending",
  });

  // FETCH LEADS

  const fetchLeads = () => {
    fetch("http://127.0.0.1:8000/leads")
      .then((response) => response.json())
      .then((data) => setLeads(data));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // FORM 

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      company: "",
      email: "",
      event: "",
      notes: "",
      follow_up_status: "Pending",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `http://127.0.0.1:8000/leads/${editingId}`
      : "http://127.0.0.1:8000/leads";

    const response = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      resetForm();
      fetchLeads();
    }
  };

  // EDIT 

  const handleEdit = (lead) => {
    setEditingId(lead.id);

    setForm({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      event: lead.event,
      notes: lead.notes,
      follow_up_status: lead.follow_up_status,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ---------------- DELETE ----------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmed) return;

    const response = await fetch(
      `http://127.0.0.1:8000/leads/${id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      fetchLeads();
    }
  };

  // SEARCH 

  const searchLeads = async () => {
    const params = new URLSearchParams({
      search: search,
      status: status,
    });

    const response = await fetch(
      `http://127.0.0.1:8000/leads/search?${params.toString()}`
    );

    const data = await response.json();

    setLeads(data);
    setSearchResultsVisible(true);
  };

  // ---------------- CLEAR SEARCH ----------------

  const clearSearch = () => {
    setSearch("");
    setStatus("");
    setSearchResultsVisible(false);
    fetchLeads();
  };

  // AI 

  const generateFollowup = async (lead) => {
    setLoadingAI(lead.id);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/ai/followup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(lead),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "AI request failed");
        return;
      }

      setFollowups({
        ...followups,
        [lead.id]: data.followup,
      });
    } catch (error) {
      console.error(error);
      alert("Could not connect to the AI service.");
    } finally {
      setLoadingAI(null);
    }
  };

  // STATUS STYLE

  const getStatusStyle = (status) => {
    if (status === "Contacted") {
      return "bg-blue-50 text-blue-700 ring-blue-200";
    }

    if (status === "Followed Up") {
      return "bg-green-50 text-green-700 ring-green-200";
    }

    return "bg-amber-50 text-amber-700 ring-amber-200";
  };

const showAllLeads = () => {
  setSearch("");
  setStatus("");
  fetchLeads();
  setSearchResultsVisible(true);
};  
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}

      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-slate-500">
                Event Lead Manager
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Manage your event leads
              </h1>

              <p className="mt-2 max-w-2xl text-slate-500">
                Capture contacts, organize conversations and create
                personalized follow-ups with AI.
              </p>
            </div>

            <div className="flex h-12 items-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white">
              {leads.length} {leads.length === 1 ? "Lead" : "Leads"}
            </div>

          </div>

        </div>
      </header>


      {/* MAIN */}

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* TOP SECTION */}

        <div className="grid gap-6 lg:grid-cols-5">

          {/* ADD LEAD */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">

            <div className="mb-6">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold">
                    {editingId ? "Edit Lead" : "Add New Lead"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {editingId
                      ? "Update the lead information below."
                      : "Add someone you met at an event."}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg">
                  +
                </div>

              </div>

            </div>


            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Rahul Sharma"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                />
              </div>


              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Company
                </label>

                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="ABC Technologies"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                />
              </div>


              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="rahul@example.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                />
              </div>


              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Event
                </label>

                <input
                  name="event"
                  value={form.event}
                  onChange={handleChange}
                  placeholder="Tech Conference 2026"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                />
              </div>


              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="What did you discuss?"
                  rows={3}
                  required
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                />
              </div>


              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Follow-up Status
                </label>

                <select
                  name="follow_up_status"
                  value={form.follow_up_status}
                  onChange={handleChange}
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                >
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Followed Up">Followed Up</option>
                </select>
              </div>


              <div className="flex gap-3 pt-2">

                <button
                  type="submit"
                  className="flex-1 cursor-pointer rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
                >
                  {editingId ? "Update Lead" : "Add Lead"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="cursor-pointer rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}

              </div>

            </form>

          </section>


          {/* SEARCH + RESULTS */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">

            {/* SEARCH HEADER */}

            <div className="mb-6">

              <h2 className="text-xl font-bold">
                Search & Filter
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Quickly find leads by name, company, event or status.
              </p>

            </div>


            {/* SEARCH CONTROLS */}

            <div className="space-y-4">

              <div>

                <label className="mb-1.5 block text-sm font-medium">
                  Search leads
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    ⌕
                  </span>

                  <input
                    type="text"
                    placeholder="Search by name, company or event..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        searchLeads();
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                  />

                </div>

              </div>


              <div>

                <label className="mb-1.5 block text-sm font-medium">
                  Follow-up Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Followed Up">Followed Up</option>
                </select>

              </div>


              <div className="flex flex-col gap-3 pt-2 sm:flex-row">

                <button
                  onClick={searchLeads}
                  className="flex-1 cursor-pointer rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
                >
                  Search Leads
                </button>

                <button
                  onClick={clearSearch}
                  className="cursor-pointer rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Clear Filters
                </button>

                <button
  onClick={showAllLeads}
  className="cursor-pointer rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
>
  Show All Leads
</button>

              </div>

            </div>


            {/* RESULTS ONLY AFTER SEARCH */}

            {searchResultsVisible && (

              <div className="mt-8 border-t border-slate-100 pt-6">

                <div className="mb-4 flex items-end justify-between">

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Results
                    </p>

                    <h3 className="mt-1 text-lg font-bold">
                      Search Results
                    </h3>
                  </div>

                  <span className="text-sm text-slate-500">
                    {leads.length}{" "}
                    {leads.length === 1 ? "result" : "results"}
                  </span>

                </div>


                {/* SCROLLABLE RESULTS */}

                <div className="max-h-[650px] space-y-4 overflow-y-auto pr-2">

                  {leads.length === 0 ? (

                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                        ?
                      </div>

                      <h3 className="font-semibold text-slate-800">
                        No leads found
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or status filter.
                      </p>

                    </div>

                  ) : (

                    leads.map((lead) => (

                      <div
                        key={lead.id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                      >

                        {/* CARD HEADER */}

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                          <div>

                            <div className="flex flex-wrap items-center gap-2">

                              <h3 className="text-lg font-bold">
                                {lead.name}
                              </h3>

                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getStatusStyle(
                                  lead.follow_up_status
                                )}`}
                              >
                                {lead.follow_up_status}
                              </span>

                            </div>

                            <p className="mt-1 text-sm font-medium text-slate-600">
                              {lead.company}
                            </p>

                          </div>

                          <span className="text-xs text-slate-400">
                            #{lead.id}
                          </span>

                        </div>


                        {/* DETAILS */}

                        <div className="mt-4 space-y-2 border-y border-slate-100 py-4">

                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Email
                            </p>

                            <p className="mt-1 break-all text-sm text-slate-700">
                              {lead.email}
                            </p>
                          </div>


                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Event
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                              {lead.event}
                            </p>
                          </div>

                        </div>


                        {/* NOTES */}

                        <div>

                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Notes
                          </p>

                          <p className="mt-2 text-sm leading-relaxed text-slate-600">
                            {lead.notes}
                          </p>

                        </div>


                        {/* ACTIONS */}

                        <div className="mt-5 flex flex-wrap gap-2">

                          <button
                            onClick={() => handleEdit(lead)}
                            className="cursor-pointer rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="cursor-pointer rounded-xl border border-red-200 px-3.5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            Delete
                          </button>

                          <button
                            onClick={() => generateFollowup(lead)}
                            disabled={loadingAI === lead.id}
                            className="cursor-pointer rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {loadingAI === lead.id
                              ? "Generating..."
                              : " Generate Follow-Up"}
                          </button>

                        </div>


                        {/* AI RESULT */}

                        {followups[lead.id] && (

                          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">

                            <div className="mb-3 flex items-center gap-2">

                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm text-white">
                                ✦
                              </div>

                              <div>
                                <h4 className="font-semibold">
                                  AI Follow-Up
                                </h4>

                                <p className="text-xs text-slate-500">
                                  Generated using your lead information
                                </p>
                              </div>

                            </div>

                            <div className="whitespace-pre-line rounded-xl bg-white p-4 text-sm leading-7 text-slate-700 shadow-sm">
                              {followups[lead.id]}
                            </div>

                          </div>

                        )}

                      </div>

                    ))

                  )}

                </div>

              </div>

            )}

          </section>

        </div>

      </div>


      {/* FOOTER */}

      <footer className="border-t bg-white">

        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-slate-400">
          Event Lead Manager · Built with Next.js, FastAPI, PostgreSQL & AI
        </div>

      </footer>

    </main>
  );
}