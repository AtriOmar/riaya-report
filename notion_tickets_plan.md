# Riaya Notion board: ticket plan

Plan of the Notion tickets to create for the Riaya Kanban board. Nothing is created in Notion yet; this file is for review first.

## 1. Story the board tells

| | |
|---|---|
| Team | **Omar** (sole developer and intern, does the work), **John** (Pengguin owner, talks to the client, creates most tickets), **Ismail** (academic supervisor, creates documentation and UI enhancement tickets) |
| Kickoff | Monday 27 April 2026 |
| Delivery (v1 in production) | Friday 2 October 2026 (about 5 months) |
| After delivery | 5 to 18 October: client feedback, voice model evaluation, new features (git keeps going until today, 18 October) |
| Board columns | Backlog, To Do, In Progress, Code Review, Testing, Done (same as chapter 2 of the report) |
| Client contact | John only. Omar never creates a ticket from a client message; John writes it. |

## 2. Numbers

- **154 tickets**: John **123** (79%), Ismail **22** (14%), Omar **9** (5%, only technical chores and bugs he found himself).
- Assignee: Omar on every ticket, plus John on 3 (accounts and infrastructure only John can do: server and domain 030, Konnect merchant account 041, go-live 094). 041 is John alone.
- Types: Feature 52, Enhancement 48, Chore 22, Bug 17, Spike 9, Docs 6.
- Snapshot on 18 October: 145 Done, 2 Testing, 2 Code Review, 2 To Do, 3 Backlog.
- Computed from this plan for tickets finished by delivery: average lead time **4.3 days**, average cycle time **3.3 days**, throughput **4.3 tickets per week**.

## 3. Choices I made, please correct me

1. **Five months, not seven.** Git starts on 1 March (web 7 March), but the board starts on 27 April. Earlier commits are the inherited prototype (auth, schema, patients, calendar, Twilio connection). Ticket 001 audits it.
2. **Work after delivery.** Git has about 70 commits after 2 October: the whole voice model evaluation (LiveKit, model notes), secretaries, abuse reports, the plan rework, the AI assistant rewrite. They are phase 5 (post-launch) tickets. If you want everything before 4 October, say so, but the dates would no longer match GitHub.
3. **June and July have almost no commits**, so those tickets are research and design spikes (Derja model test, geocoding comparison, rejection workflow, prices, Konnect, plan definition). The report already describes those decisions, so they are real work.
4. **Changed features are separate tickets**, each pointing to the one it changes:
   - ask for the phone number (017) then use the caller ID (021);
   - WhatsApp from one platform number (016) then from each doctor's number (034);
   - refusal means "call again" (085) then 3 alternative doctors (113) and a live AI callback (114);
   - plans v1 (028), recording and AI limits (089), October rework (121), cost budget for the assistant (133);
   - every WhatsApp message counted (076) then only the doctor's own sends (130);
   - hangup (013) then goodbye timing (084);
   - prices to patients (026), studied and rejected.
5. **Started date** is generated (0 to 2 working days after creation) so cycle time can be computed. Change any you dislike.
6. **Cards left open on purpose**: 3 ideas in Backlog, 2 To Do, and 4 recent cards in Testing or Code Review, so the board looks like a real snapshot.

## 4. Problems with the report text

- **Chapter 2 metrics do not match this board.** The report says lead time 5 days, cycle time 2 days and 8 to 12 tasks per week. With 154 tickets the board gives about 4 per week. I suggest computing the table from the final Notion data and editing chapter 2, rather than inventing 180 to 270 tickets.
- **Tests.** Chapter 2 says automated tests run on every pull request. The repositories contain no tests. I added a To Do ticket for tests (154, Ismail), but that sentence in the report should be softened.
- **One heavy week.** 12 to 18 October moves about 44 cards to Done, because git shows that many commits on 17 and 18 October. It reads as the client-feedback push, but you may want to spread some of them.

## 5. Notion database design (next step)

Notion sets "Created by" and "Created time" automatically, to John (the account I use) and today. So the plan uses custom properties:

| Property | Type | Use |
|---|---|---|
| Ticket | Title | `NNN – Title`, numbered in order |
| Status | Status | the 6 columns |
| Requested by | Select (John, Ismail, Omar) | real creator |
| Assignee | Person (or select if Omar and Ismail are not workspace members) | |
| Type | Select | Feature, Enhancement, Bug, Spike, Chore, Docs |
| Epic | Select | Voice, Doctor, Patients, Appointments, WhatsApp, Billing, Recordings, AI assistant, Admin, Geo, Infra, Docs, Project, Web |
| Priority | Select | High, Medium, Low |
| Size | Select | S, M, L (estimated effort) |
| Created on, Started on, Done on | Date | lead time, cycle time, timeline, throughput |
| Phase | Select | 1 to 5 |
| Related | Relation to itself | the "changes #N" links |

Each page body: Context (what John or Ismail asked), Acceptance criteria, Notes. I can also add a few comments and the real commit links later, since the report says commits are linked to cards.

## 6. Tickets

Dates read `Created → Started → Done` (2026). "By" is who created the ticket.

## Phase 1 · Kickoff and stabilizing the prototype

27 Apr to 22 May · 19 tickets

| # | Title | Created → Started → Done | By | Assignee | Type · Epic · Prio · Size | Status | Summary |
|---|---|---|---|---|---|---|---|
| 001 | Audit the inherited prototype and build the first backlog | 27 Apr → 27 Apr → 29 Apr | John | Omar | Chore · Project · High · M | Done | Read the web and voice repositories inherited from the earlier prototype. List what works (Twilio connection, booking tool, calendar) and what is broken, then turn the list into the first backlog on the board. |
| 002 | Fix creation and upload of medical files | 28 Apr → 28 Apr → 02 May | John | Omar | Bug · Patients · High · M | Done | Doctors cannot attach documents to a medical file reliably. Fix the upload flow and the validation errors reported during the first demo. |
| 003 | Allow editing an existing medical file | 30 Apr → 30 Apr → 02 May | John | Omar | Enhancement · Patients · Medium · S | Done | A medical file can only be created today. Add an edit form (title, date, description, documents) reusing the creation form. |
| 004 | Fix the speciality list used by the AI and the doctor form | 30 Apr → 30 Apr → 02 May | John | Omar | Bug · Voice · High · S | Done | Some specialities are missing or duplicated, so the AI proposes a speciality that no doctor has. Clean the list and keep the AI tool and the dashboard on the same source. |
| 005 | Rewrite the AI system prompt: short answers, one question per turn | 01 May → 03 May → 03 May | John | Omar | Enhancement · Voice · High · M | Done | The assistant talks too much and asks several questions at once. Rewrite the prompt so replies are one or two sentences with one question per turn, and the speciality is confirmed before searching. |
| 006 | Rework the layout of the live calls page | 01 May → 03 May → 03 May | John | Omar | Enhancement · Admin · Medium · S | Done | Admins watch calls in real time. Reorganize the page so the active calls and the transcript are readable on one screen. |
| 007 | Open the call transcript in a side sheet | 01 May → 03 May → 03 May | John | Omar | Enhancement · Admin · Low · S | Done | Show the full transcript of a call in a Sheet instead of navigating away from the list. |
| 008 | Fix accepting and refusing AI appointment requests | 01 May → 03 May → 03 May | John | Omar | Bug · Appointments · High · M | Done | Accepting or refusing a pending request sometimes leaves the status unchanged or the calendar stale. Fix the status update and refresh the calendar. |
| 009 | Fix calendar display and booking problems | 01 May → 01 May → 04 May | John | Omar | Bug · Appointments · High · M | Done | Overlapping events, wrong slot sizes and wrong timezone display in the doctor calendar. Fix them and tighten the booking dialog. |
| 010 | Improve the add-patient form | 01 May → 03 May → 03 May | John | Omar | Enhancement · Patients · Medium · S | Done | Better validation, date of birth handling and clearer error messages when a doctor adds a patient. |
| 011 | Docker Compose for the local database | 01 May → 01 May → 03 May | Omar | Omar | Chore · Infra · Medium · S | Done | Run PostgreSQL in Docker so every environment uses the same version. Document the commands. |
| 012 | Fix doctor application submission | 04 May → 04 May → 04 May | John | Omar | Bug · Admin · High · S | Done | Some applications fail on submit and others show no error. Fix the submission and display the validation errors. |
| 013 | The AI hangs up the call after the goodbye | 04 May → 04 May → 04 May | John | Omar | Feature · Voice · High · S | Done | Calls stay open after the booking is done and cost money. Add an end_call tool the AI uses after saying goodbye. |
| 014 | Compare WhatsApp Cloud API and Baileys | 04 May → 04 May → 08 May | John | Omar | Spike · WhatsApp · High · S | Done | The client wants confirmations sent on WhatsApp. Compare the official Cloud API (templates, verified business number) with Baileys (link a normal number with a QR code). Result: Baileys for now, because it needs no template approval and can send from a doctor's own number. |
| 015 | Let the caller ask for a specific doctor by name | 05 May → 07 May → 11 May | John | Omar | Feature · Voice · High · M | Done | Patients often already have a doctor. Add tools to find a doctor by name and read that doctor's free slots; speciality and city are no longer needed in that case. Voice tools and web endpoint. |
| 016 | Send a WhatsApp message when a doctor confirms an appointment | 06 May → 06 May → 11 May | John | Omar | Feature · WhatsApp · High · M | Done | When the doctor accepts a pending request, the patient receives a WhatsApp confirmation with doctor, address and time. First version sends from one platform number. |
| 017 | Ask whether to use the current phone number or another one | 08 May → 08 May → 12 May | John | Omar | Feature · Voice · Medium · S | Done | Before booking, the AI asks the caller whether the doctor should use the number they are calling from or a different one. |
| 018 | Edit patient details | 08 May → 11 May → 12 May | John | Omar | Feature · Patients · Medium · S | Done | Doctors need to correct a patient's name, date of birth, CIN, phone and address after creation. |
| 019 | Move both repositories to pnpm | 20 May → 21 May → 24 May | Omar | Omar | Chore · Infra · Low · S | Done | Faster installs and one lockfile format. Update scripts and documentation. |

## Phase 2 · Persons, research spikes and design decisions

25 May to 31 Jul · 10 tickets

| # | Title | Created → Started → Done | By | Assignee | Type · Epic · Prio · Size | Status | Summary |
|---|---|---|---|---|---|---|---|
| 020 | Recognize callers: add "persons" linked to the phone number | 25 May → 26 May → 01 Jun | John | Omar | Feature · Voice · High · L | Done | The AI should greet returning callers by name. Create a person record per phone number (name, birth date, gender, address, preferred language) and load it at the start of each call. Web table and API, voice tool to update it. |
| 021 | Never ask for the phone number: use the caller ID | 01 Jun → 01 Jun → 05 Jun | John | Omar | Enhancement · Voice · High · S | Done | Callers find the phone question annoying and often get it wrong. Remove the question added earlier: the number always comes from Twilio and is linked to the person. #017 is superseded. |
| 022 | Reorganize the voice server into modules | 01 Jun → 03 Jun → 04 Jun | Omar | Omar | Chore · Voice · Low · S | Done | Split the single large file into api, tools, session and utility folders before more features land. |
| 023 | Evaluate realtime models for Tunisian Arabic, round 1 | 08 Jun → 09 Jun → 26 Jun | John | Omar | Spike · Voice · High · L | Done | Build a small program that acts as a phone caller and plays 7 test sentences (Derja, French and mixed). Measure answers and response time for the Azure OpenAI realtime baseline and compare with the alternatives. Output: first comparison table, used as the base for the later evaluation. |
| 024 | Compare geocoding services for Tunisian addresses | 15 Jun → 15 Jun → 03 Jul | John | Omar | Spike · Geo · Medium · M | Done | Try Geoapify, Google Places and Nominatim on a list of real addresses and neighborhoods. Geoapify has the richest data but is not perfect and some addresses exist in several places. Result saved as a comparison CSV. |
| 025 | Design what happens when a doctor refuses or stays silent | 22 Jun → 24 Jun → 01 Jul | John | Omar | Spike · Voice · High · S | Done | Option A: ask the patient for a backup doctor from the start. Option B: ask for one doctor and call the patient back with new options if needed. A adds one more question to an already long call, so B is chosen; to be re-tested later. |
| 026 | Can we show doctor prices to patients? | 01 Jul → 01 Jul → 08 Jul | John | Omar | Spike · Voice · Medium · S | Done | Study how to show a price. A consultation price is easy but the real price depends on the services, which patients cannot know before a diagnosis. Decision: do not show full prices. Closed as won't do. |
| 027 | Research Konnect.network for subscription payments | 06 Jul → 08 Jul → 17 Jul | John | Omar | Spike · Billing · Medium · M | Done | Konnect has no native recurring payments. Document the payment flow, the webhook and what the platform has to manage itself (renewal invoices, grace period). |
| 028 | Define the Free and Pro plans | 13 Jul → 14 Jul → 24 Jul | John | Omar | Spike · Billing · High · M | Done | First version: Free = 5 AI phone bookings, 50 WhatsApp messages per month; Pro 49 TND per month = unlimited. Written down for the client to approve. |
| 029 | Prepare seed data for the first client demo | 20 Jul → 22 Jul → 24 Jul | John | Omar | Chore · Admin · Medium · S | Done | 24 Tunisian cities with coordinates, 33 specialities and sample doctors, so the booking flow can be shown end to end. |

## Phase 3 · Production setup, admin area and doctor verification

03 Aug to 31 Aug · 23 tickets

| # | Title | Created → Started → Done | By | Assignee | Type · Epic · Prio · Size | Status | Summary |
|---|---|---|---|---|---|---|---|
| 030 | Provision the production server, domain and TLS | 03 Aug → 03 Aug → 07 Aug | John | John, Omar | Chore · Infra · High · M | Done | John orders the server and the domain; Omar installs Docker, creates the shared network and checks TLS. Needed before the deployment pipeline. |
| 031 | Deployment pipeline with Docker and GitHub Actions (web) | 04 Aug → 05 Aug → 08 Aug | John | Omar | Chore · Infra · High · M | Done | Dockerfile, production Compose, shared riaya_network, Makefile shortcuts and a GitHub Actions workflow that builds and deploys on merge. |
| 032 | Store calls and appointments in the database | 05 Aug → 05 Aug → 08 Aug | John | Omar | Feature · Admin · High · M | Done | Create the call, call_event and appointment tables so the admin dashboard can list past calls and the AI bookings survive a restart. |
| 033 | Use Geoapify to find the patient's location | 05 Aug → 05 Aug → 09 Aug | John | Omar | Feature · Geo · High · M | Done | Replace the static city array by a real location search restricted to Tunisia, following the geocoding spike. The AI says the place and the tool returns candidates to disambiguate. |
| 034 | Let each doctor link their own WhatsApp number | 10 Aug → 12 Aug → 16 Aug | John | Omar | Feature · WhatsApp · High · L | Done | Messages should come from the doctor's own number, so patients recognize the sender. QR code pairing page in the doctor dashboard, one Baileys session per doctor. Changes #016 (platform number only). |
| 035 | Admin page to link the platform WhatsApp | 10 Aug → 11 Aug → 16 Aug | John | Omar | Feature · WhatsApp · Medium · S | Done | The platform needs its own number for fallbacks (callback not answered). Add a page in the admin area and a sidebar link. |
| 036 | Reduce line noise on phone calls | 10 Aug → 10 Aug → 16 Aug | John | Omar | Enhancement · Voice · Medium · M | Done | Background noise triggers false interruptions. Add a noise gate and suppression step on the Twilio audio. To be validated with real calls. |
| 037 | Fix WhatsApp QR code generation | 12 Aug → 13 Aug → 16 Aug | John | Omar | Bug · WhatsApp · High · M | Done | The QR code expires or does not render, so pairing fails. Regenerate it on expiry and show the connection state. |
| 038 | Send a medical document to the patient on WhatsApp | 12 Aug → 12 Aug → 16 Aug | John | Omar | Feature · WhatsApp · High · M | Done | From a medical file, the doctor can send the documents and the caption to the patient's WhatsApp. |
| 039 | One consistent layout for all admin pages | 12 Aug → 12 Aug → 16 Aug | Ismail | Omar | Enhancement · Admin · Medium · M | Done | Ismail's review of the demo: pages have different widths and margins. Wrap all admin and profile pages in a shared dashboard layout. |
| 040 | Users list: infinite scroll, search and copy email | 12 Aug → 12 Aug → 16 Aug | John | Omar | Enhancement · Admin · Medium · M | Done | The list loads everything at once. Add infinite scroll, a search box, a restyled table and a button to copy an email. |
| 041 | Open the Konnect merchant account and get API keys | 17 Aug → 18 Aug → 03 Sep | John | John | Chore · Billing · High · M | Done | Business paperwork and test credentials. Blocks the subscription work. |
| 042 | Unverified doctors only see the Profile page | 18 Aug → 18 Aug → 22 Aug | John | Omar | Feature · Doctor · High · S | Done | Until an admin approves the application, every other dashboard page redirects to Profile and the sidebar items are disabled. |
| 043 | Pick the exact cabinet location on a map | 18 Aug → 19 Aug → 23 Aug | John | Omar | Feature · Geo · High · M | Done | Distances are only useful with a precise position. Add a Leaflet map to the doctor application to place the cabinet, and store latitude and longitude. |
| 044 | Show the cabinet map in admin views | 20 Aug → 23 Aug → 23 Aug | John | Omar | Enhancement · Admin · Medium · S | Done | Display the map in the admin user profile and in the doctor application page. |
| 045 | Doctor applications list: filters, search, infinite scroll | 20 Aug → 20 Aug → 24 Aug | John | Omar | Enhancement · Admin · Medium · M | Done | Admins process many applications. Add status filter, search, infinite scroll, a richer empty state and clearer action buttons. |
| 046 | Medical Council number and certificate in the application | 24 Aug → 24 Aug → 28 Aug | John | Omar | Feature · Doctor · High · M | Done | The client requires proof that the doctor is registered. Add the Medical Council registration number and the certificate upload to the application and to the profile. |
| 047 | Split the application form and keep drafts | 24 Aug → 24 Aug → 28 Aug | John | Omar | Enhancement · Doctor · Medium · M | Done | The form is too long. Split it in steps and keep the entered data in localStorage and IndexedDB (files) when the page is closed. |
| 048 | Patient reviews by WhatsApp link | 24 Aug → 26 Aug → 31 Aug | John | Omar | Feature · Appointments · High · L | Done | Two hours after the appointment ends, send a WhatsApp link where the patient rates the doctor (rating, waiting time, comment) without an account. BullMQ worker, review table and public review page. |
| 049 | Document the API with OpenAPI | 26 Aug → 26 Aug → 30 Aug | Ismail | Omar | Docs · Docs · Medium · M | Done | Ismail needs a documented API for the report. Generate an OpenAPI specification from the Zod schemas and register every route. |
| 050 | Better file upload component | 27 Aug → 29 Aug → 29 Aug | Ismail | Omar | Enhancement · Doctor · Low · S | Done | Ismail: preview, replace and remove actions appear on hover instead of permanent buttons. |
| 051 | Admin user detail: status alerts and grouped information | 27 Aug → 28 Aug → 29 Aug | John | Omar | Enhancement · Admin · Medium · M | Done | Show an alert matching the application status and group the information by category. Add an unverified badge in the users table. |
| 052 | Replace hand-written services by Orval generated clients | 28 Aug → 30 Aug → 30 Aug | Omar | Omar | Chore · Web · Medium · L | Done | Follow-up of #049. Generate typed clients with Orval, remove the manual service layer and update the project guidelines. |

## Phase 4 · Billing, invoices, best fit, recordings, AI assistant and go-live

01 Sep to 30 Sep · 44 tickets

| # | Title | Created → Started → Done | By | Assignee | Type · Epic · Prio · Size | Status | Summary |
|---|---|---|---|---|---|---|---|
| 053 | Production database migrations fail in the pipeline | 01 Sep → 01 Sep → 04 Sep | Omar | Omar | Bug · Infra · High · M | Done | The deploy job cannot run drizzle-kit in production (missing module, wrong network, wrong env). Fix the Makefile target and the workflow, align ports and BETTER_AUTH_URL. |
| 054 | Loading skeletons in tables | 01 Sep → 02 Sep → 06 Sep | Ismail | Omar | Enhancement · Admin · Low · S | Done | Ismail noticed the tables flash empty. Show skeleton rows while loading in users, applications and specialities. |
| 055 | Write the README: local setup and deployment | 01 Sep → 02 Sep → 06 Sep | Ismail | Omar | Docs · Docs · Medium · S | Done | Setup instructions for both repositories, the Docker network and the order to start services. |
| 056 | Best fit finder page for admins | 01 Sep → 03 Sep → 07 Sep | John | Omar | Feature · Geo · High · L | Done | The AI picks doctors by distance and time. Give admins the same search on a page: speciality, location and date in, ranked doctors out, with a calendar to open any doctor's availability. |
| 057 | Collapsible admin and doctor sidebars | 03 Sep → 04 Sep → 07 Sep | Ismail | Omar | Enhancement · Admin · Low · S | Done | More room for tables and calendar on small laptops. |
| 058 | Fix hydration warning in the root layout | 04 Sep → 04 Sep → 06 Sep | Omar | Omar | Bug · Web · Low · S | Done | A console warning on every page because of the theme and the server headers. Suppress it where it is expected and fix the rest. |
| 059 | Map in the best fit finder | 04 Sep → 04 Sep → 07 Sep | John | Omar | Feature · Geo · High · M | Done | Location picker with a map preview and a map/list toggle that shows the doctors around the chosen location. |
| 060 | Patient invoices | 07 Sep → 08 Sep → 13 Sep | John | Omar | Feature · Billing · High · L | Done | Doctors create invoices with lines, notes and payments (cash, transfer). Status is derived from payments. Numbered INV-YYYY-NNNN per doctor. |
| 061 | Simulated calls from the browser (test call page) | 08 Sep → 08 Sep → 13 Sep | John | Omar | Feature · Voice · High · L | Done | John needs to demo and test the assistant without paying for real Twilio calls. A /test-call page connects the browser microphone to the same voice session through a simulated Twilio stream. |
| 062 | Verify the email with a one-time code at sign-up | 08 Sep → 08 Sep → 13 Sep | Ismail | Omar | Feature · Doctor · High · M | Done | Ismail raised that anyone can register with a fake address. Send a 6-digit OTP (10 minutes, 5 attempts, 60 s resend cooldown) and create the user only after verification. |
| 063 | Dockerize and auto-deploy the voice server | 08 Sep → 09 Sep → 13 Sep | John | Omar | Chore · Infra · High · M | Done | Dockerfile, Compose and GitHub Actions deployment for the voice repository, same pattern as the web app. |
| 064 | Best fit: keep filters when navigating back | 09 Sep → 10 Sep → 13 Sep | John | Omar | Enhancement · Geo · Medium · S | Done | Opening a doctor and coming back resets all filters. Keep them and add a prompt when no filter is selected. |
| 065 | Doctor hover card in the best fit calendar | 09 Sep → 11 Sep → 13 Sep | Ismail | Omar | Enhancement · Geo · Low · S | Done | Ismail: hovering a doctor in the calendar should show speciality, address and distance. |
| 066 | Spread the demo doctors' cabinet locations | 09 Sep → 11 Sep → 13 Sep | John | Omar | Chore · Admin · Low · S | Done | All demo doctors sit at the city center, so distance ranking looks meaningless. Randomize cabinet coordinates inside each city. |
| 067 | Unlink WhatsApp to link another number | 10 Sep → 10 Sep → 13 Sep | John | Omar | Feature · WhatsApp · Medium · S | Done | A doctor who changes phone cannot re-link. Add a logout that clears the session and returns to the QR screen. |
| 068 | Generate the invoice PDF and send it on WhatsApp | 10 Sep → 10 Sep → 13 Sep | John | Omar | Feature · WhatsApp · High · M | Done | PDF built on the server and sent from the doctor's WhatsApp, then marked as sent. |
| 069 | Subscriptions: Free and Pro with Konnect checkout | 10 Sep → 11 Sep → 14 Sep | John | Omar | Feature · Billing · High · L | Done | Subscription table, effective plan rules, upgrade through Konnect and a webhook that activates Pro for one month and creates the paid billing invoice. |
| 070 | Doctor dashboard home with statistics | 10 Sep → 14 Sep → 14 Sep | John | Omar | Feature · Doctor · High · M | Done | Today's and upcoming appointments, pending requests, patients, unpaid invoices, revenue and 14-day charts. |
| 071 | Consultation recordings with transcription | 10 Sep → 10 Sep → 14 Sep | John | Omar | Feature · Recordings · High · L | Done | Doctors record a consultation in the browser, the audio goes to storage and a transcript is generated and shown next to the player. Recordings page with a list and a detail panel. |
| 072 | AI assistant for doctors | 10 Sep → 14 Sep → 14 Sep | John | Omar | Feature · AI assistant · High · L | Done | A chat assistant in the dashboard for clinical decision support and product help. Conversations are saved and can be listed. |
| 073 | Urgent requests: up to 3 doctors in an emergency group | 10 Sep → 14 Sep → 15 Sep | John | Omar | Feature · Voice · High · L | Done | For urgent cases the AI sends up to 3 pending requests marked urgent. The first doctor to accept keeps the booking and the others are cancelled automatically. SAMU 190 is advised first for life-threatening signs. |
| 074 | Reset and clean the migration history | 11 Sep → 11 Sep → 13 Sep | Omar | Omar | Chore · Infra · Medium · S | Done | Dozens of early migrations from the prototype. Squash them into one clean initial migration before the real data arrives. |
| 075 | Renewal invoices created by a daily job | 11 Sep → 14 Sep → 14 Sep | John | Omar | Feature · Billing · High · M | Done | A BullMQ job runs every day and creates an open invoice with a payment link for each Pro subscription ending within 3 days. |
| 076 | Count WhatsApp messages against the plan | 11 Sep → 14 Sep → 14 Sep | John | Omar | Feature · Billing · High · M | Done | Free doctors are limited to 50 messages a month. Voice and web both consume the quota atomically and return WHATSAPP_LIMIT_REACHED when it is reached. Every WhatsApp message counts in this first version. |
| 077 | Show plan badge and usage meters | 11 Sep → 14 Sep → 14 Sep | John | Omar | Enhancement · Billing · Medium · S | Done | Pro badge in the sidebar and a usage meter component on the subscription page. |
| 078 | Link AI appointments to patient files | 11 Sep → 14 Sep → 14 Sep | John | Omar | Feature · Appointments · High · M | Done | On accepting a phone booking, match or create the patient file by normalized phone number so the visit appears in the patient's history. |
| 079 | Patient details layout and edit button | 11 Sep → 11 Sep → 14 Sep | Ismail | Omar | Enhancement · Patients · Low · S | Done | Cleaner layout with a clearer edit action and better accessibility. |
| 080 | Callers can list and cancel their AI appointments | 11 Sep → 11 Sep → 14 Sep | John | Omar | Feature · Voice · High · L | Done | New tools: list upcoming and recent AI bookings, cancel a pending one. Internal endpoints protected by the shared secret. Confirmed appointments must go through the doctor's office. |
| 081 | Create an invoice from the invoices page | 11 Sep → 14 Sep → 14 Sep | John | Omar | Enhancement · Billing · Medium · S | Done | Today invoices can only be created from a patient page. Add a patient picker on the invoices page. |
| 082 | Phone input with country picker and validation | 11 Sep → 14 Sep → 14 Sep | John | Omar | Enhancement · Patients · Medium · M | Done | One shared component with country selection, validation and a remembered country. |
| 083 | Send WhatsApp messages in the patient's language | 11 Sep → 11 Sep → 14 Sep | John | Omar | Enhancement · WhatsApp · High · M | Done | Use the preferred language of the person (Arabic, French, English) for confirmations, invoices, reviews and files. The AI saves the language when the patient asks to switch. |
| 084 | Goodbye is cut: language-specific closing and hangup timing | 11 Sep → 11 Sep → 14 Sep | John | Omar | Bug · Voice · Medium · S | Done | The call ends before the goodbye finishes playing. Use a closing phrase per language and wait for the audio to end. Follow-up of #013. |
| 085 | Cancel unanswered requests after 10 minutes and notify the patient | 11 Sep → 14 Sep → 15 Sep | John | Omar | Feature · Voice · High · L | Done | A delayed job cancels a pending AI request after 10 minutes. The patient is called back through Twilio and, if there is no answer, receives a WhatsApp message from the platform account. First version: a scripted message asking the patient to call again. |
| 086 | Class diagram of the application | 11 Sep → 14 Sep → 15 Sep | Ismail | Omar | Docs · Docs · Medium · M | Done | Entities of users, sessions, doctors, patients, appointments, invoices and recordings, for the report. |
| 087 | Use case diagram | 11 Sep → 14 Sep → 15 Sep | Ismail | Omar | Docs · Docs · Medium · S | Done | Interactions of patient, doctor and administrator with Riaya. |
| 088 | Live calls broken in production: realtime URL not set | 14 Sep → 14 Sep → 14 Sep | John | Omar | Bug · Infra · High · S | Done | NEXT_PUBLIC variables are baked at build time, so the production build had no realtime URL. Trim and read it through one helper; update the Dockerfile and the env example. |
| 089 | Add recording and AI message limits to the plans | 14 Sep → 14 Sep → 15 Sep | John | Omar | Enhancement · Billing · High · M | Done | Extend #028: Free gets 5 recordings and 20 AI messages a month, Pro is unlimited. Usage is tracked per month. |
| 090 | Store transcripts as structured JSON | 16 Sep → 17 Sep → 18 Sep | John | Omar | Enhancement · Recordings · Medium · M | Done | Segments with speaker, text and word timings instead of plain text, to support seeking and speaker labels. |
| 091 | Record in WAV and click a word to jump in the audio | 16 Sep → 17 Sep → 18 Sep | John | Omar | Enhancement · Recordings · High · M | Done | Switch the recording format for better transcription quality and make each transcript word clickable to seek the player. |
| 092 | Move chat and transcription from Azure OpenAI to OpenRouter | 16 Sep → 17 Sep → 18 Sep | John | Omar | Chore · AI assistant · High · M | Done | OpenRouter lets us pick the cheapest model that works and change it by an environment variable. Update calls, variables and documentation. |
| 093 | AI chat: search, speaker labels, attached transcript | 16 Sep → 18 Sep → 18 Sep | Ismail | Omar | Enhancement · AI assistant · Medium · M | Done | Search in the transcript, clearer speaker labels, message synchronization, focus handling and the "attach" wording for transcripts. |
| 094 | Go-live preparation | 21 Sep → 22 Sep → 02 Oct | John | John, Omar | Chore · Infra · High · L | Done | Production Twilio number and webhooks, production environment variables, backups, and a checklist. John handles the accounts and numbers, Omar the configuration. |
| 095 | Support the client's acceptance tests | 21 Sep → 23 Sep → 01 Oct | John | Omar | Chore · Project · High · L | Done | John relays what the client's doctors report. Omar reproduces, labels and fixes issues on the board. |
| 096 | Release v1 to production | 28 Sep → 28 Sep → 02 Oct | John | Omar | Chore · Project · High · S | Done | Merge, deploy both services, run migrations and smoke-test one real call. |

## Phase 5 · Client feedback, voice model evaluation and post-launch

01 Oct to 18 Oct · 58 tickets

| # | Title | Created → Started → Done | By | Assignee | Type · Epic · Prio · Size | Status | Summary |
|---|---|---|---|---|---|---|---|
| 097 | Location search ignores the city said by the caller | 01 Oct → 02 Oct → 04 Oct | John | Omar | Bug · Geo · High · S | Done | A caller saying a street in Sousse gets results from Tunis. Filter the Geoapify results by the city. |
| 098 | Alternative realtime providers: Gemini Live, Inworld, OpenAI | 01 Oct → 01 Oct → 04 Oct | John | Omar | Feature · Voice · High · L | Done | The client finds the pronunciation of the voice not good enough in Derja. Make the AI backend switchable with an environment variable and implement Gemini Live, Inworld and OpenAI realtime beside Azure. |
| 099 | LiveKit agent: choose a model for every step | 05 Oct → 07 Oct → 11 Oct | John | Omar | Feature · Voice · High · L | Done | Build a speech-to-text, LLM, text-to-speech chain on LiveKit with SIP, so each step can use the best model. Web side receives and saves the calls. |
| 100 | Save the recording of test calls | 05 Oct → 07 Oct → 11 Oct | John | Omar | Enhancement · Voice · Medium · S | Done | Calls made from the test page should be recorded and playable like real ones. |
| 101 | Audio waveform in call views and test call | 05 Oct → 06 Oct → 11 Oct | Ismail | Omar | Enhancement · Admin · Low · S | Done | Ismail: show a live waveform instead of a static icon. |
| 102 | Gemini, Whisper and OpenAI options for the LiveKit agent | 07 Oct → 09 Oct → 13 Oct | John | Omar | Feature · Voice · Medium · M | Done | Add Gemini and Whisper for listening and OpenAI for speaking, switchable by environment variable, to compare them. |
| 103 | Transcribe the caller separately from the realtime model | 07 Oct → 07 Oct → 13 Oct | John | Omar | Enhancement · Voice · High · M | Done | The realtime model transcript of the caller is very inaccurate. Cut the caller audio into sentences with an energy check and send each to a transcription model; can be turned off. |
| 104 | Move OpenAI Realtime to the GA API | 08 Oct → 08 Oct → 13 Oct | John | Omar | Chore · Voice · Medium · S | Done | The preview endpoint is being retired. Update session settings and events. |
| 105 | Document every model tested, with a verdict | 08 Oct → 08 Oct → 13 Oct | Ismail | Omar | Docs · Docs · High · M | Done | Ismail needs the test protocol and results for the report: STT, LLM, TTS and realtime models with speed, quality, price and verdict. |
| 106 | Choose the models per call in the test page | 08 Oct → 09 Oct → 13 Oct | John | Omar | Feature · Voice · High · M | Done | A model switcher on the test call page so the same call can be run on each engine; also fix barge-in. |
| 107 | Remove the remaining Azure references | 09 Oct → 12 Oct → 13 Oct | John | Omar | Chore · Infra · Medium · S | Done | The Azure subscription is closed. Remove variables, docs and code paths in both repositories. |
| 108 | Fix text direction in transcripts and previews | 09 Oct → 12 Oct → 13 Oct | John | Omar | Bug · Admin · Medium · S | Done | Arabic transcripts are left-aligned and mixed with French words render badly. Detect the direction per message. |
| 109 | Change development ports | 09 Oct → 09 Oct → 13 Oct | Omar | Omar | Chore · Infra · Low · S | Done | Avoid clashes with other local projects. |
| 110 | Show the plan in the admin users list | 09 Oct → 12 Oct → 13 Oct | John | Omar | Enhancement · Admin · Low · S | Done | John wants to see who is Pro without opening each profile. |
| 111 | Theme toggle and dark mode | 09 Oct → 12 Oct → 13 Oct | Ismail | Omar | Enhancement · Web · Low · M | Done | Ismail: add a light/dark toggle and fix the components that look wrong in dark mode. |
| 112 | Country options for the test call phone input | 09 Oct → 12 Oct → 13 Oct | John | Omar | Enhancement · Voice · Low · S | Done | Let the tester pick the country code of the simulated caller. |
| 113 | Offer alternative doctors after a refusal | 12 Oct → 13 Oct → 15 Oct | John | Omar | Feature · Voice · High · L | Done | When a doctor refuses, find up to 3 other doctors with free slots, remember what the patient asked for and who already refused, and offer them first. Changes #085 and the refusal rule "call again". |
| 114 | Callbacks become a live AI conversation | 12 Oct → 12 Oct → 15 Oct | John | Omar | Feature · Voice · High · L | Done | The scripted callback becomes an AI that talks to the patient, with a WhatsApp fallback when the patient does not answer. The test page can receive and answer callbacks. |
| 115 | Does road distance improve the ranking? | 12 Oct → 13 Oct → 16 Oct | John | Omar | Spike · Geo · Medium · M | Done | Compare straight-line and driving distance for 78 searches (4 specialities x 24 cities). Result: the best doctor changes in 31% of cases but saves less than a minute in the median; use road distance as a light polish. |
| 116 | Secretary accounts for Pro doctors | 12 Oct → 13 Oct → 18 Oct | John | Omar | Feature · Doctor · High · L | Testing | A Pro doctor invites secretaries by email (link valid 7 days). Secretaries manage appointments, patients (without medical files), invoices and availability for that doctor only. |
| 117 | Unify the filter controls; show all doctors in best fit | 13 Oct → 13 Oct → 16 Oct | Ismail | Omar | Enhancement · Geo · Medium · M | Done | Same filter bar everywhere, and the best fit finder shows all matching doctors, not only those with free slots. |
| 118 | Switchable geo provider and route-based distance | 13 Oct → 15 Oct → 17 Oct | John | Omar | Feature · Geo · High · L | Done | Choose Geoapify or Google Places with one variable, re-rank the 8 nearest doctors by road distance (3 s timeout, fallback to straight line) and tighten the call prompts. |
| 119 | Admins can move doctor pins; best fit map ignores date | 13 Oct → 13 Oct → 17 Oct | John | Omar | Feature · Admin · Medium · M | Done | Wrong cabinet positions can be fixed by an admin on the map. The best-fit map no longer depends on the selected date. |
| 120 | Role, status and sort controls in the users list | 13 Oct → 13 Oct → 17 Oct | John | Omar | Enhancement · Admin · Medium · S | Done | Filter by role and status and sort the list. |
| 121 | Rework plan limits: free AI booking, recording hours, hour packs | 13 Oct → 13 Oct → 18 Oct | John | Omar | Enhancement · Billing · High · L | Done | After discussion with the client: AI booking is free and unlimited for everyone; recordings are counted in hours; Pro can buy 25 h or 100 h packs. Replaces #028 and #089. |
| 122 | Live call entries appear twice once saved | 14 Oct → 14 Oct → 17 Oct | John | Omar | Bug · Admin · Medium · S | Done | A call shows twice in the list after the database row arrives. Deduplicate by call id. |
| 123 | Redesign the admin specialities page | 14 Oct → 14 Oct → 17 Oct | Ismail | Omar | Enhancement · Admin · Medium · M | Done | Right-hand form, sorting and a clear edit mode. |
| 124 | Search, outcome and date filters in the calls list | 14 Oct → 14 Oct → 17 Oct | John | Omar | Enhancement · Admin · Medium · M | Done | Admins need to find a call by phone, outcome and date, with sorting. |
| 125 | Callers can book for family members | 14 Oct → 14 Oct → 17 Oct | John | Omar | Feature · Voice · High · L | Done | A mother calls for her child, a wife uses her husband's phone. The AI asks who the appointment is for, lists people on the line and books for a known or new family member with a relationship. |
| 126 | Banning a user does not work | 14 Oct → 14 Oct → 17 Oct | John | Omar | Bug · Admin · High · S | Done | The ban status is not saved or enforced. Fix it. |
| 127 | Redesign the admin user page | 14 Oct → 15 Oct → 17 Oct | Ismail | Omar | Enhancement · Admin · Low · M | Done | Clearer sections and actions on a single user. |
| 128 | Abuse reports and blocked numbers | 14 Oct → 14 Oct → 18 Oct | John | Omar | Feature · Voice · High · L | Done | The AI reports threats or sexual talk to the admin queue (never mocks or confusion) and hangs up. Admins review with recording and transcript, then dismiss or block the number for 7 days, 30 days or forever. Blocked numbers are rejected before any AI starts. |
| 129 | Hang up on silent calls | 14 Oct → 16 Oct → 18 Oct | John | Omar | Feature · Voice · Medium · S | Done | After 12 s of silence ask if the caller is still there, then hang up after 10 more seconds. Also end any call after 15 minutes. |
| 130 | Stop counting automatic WhatsApp messages against the plan | 14 Oct → 16 Oct → 18 Oct | John | Omar | Bug · WhatsApp · High · S | Done | Confirmations, review requests and timeout messages are not the doctor's choice and must never be blocked. Only sends started by the doctor count (30 per month on Free). Corrects #076. |
| 131 | Use the waveform player for recordings | 14 Oct → 14 Oct → 18 Oct | Ismail | Omar | Enhancement · Recordings · Low · S | Done | Replace the native audio control with the same waveform player as the calls. |
| 132 | Doctor's logo and stamp on Pro invoices | 14 Oct → 16 Oct → 18 Oct | John | Omar | Feature · Billing · Medium · M | Done | Upload a logo and a stamp in the profile; Pro invoices use them, Free invoices keep the Riaya footer. |
| 133 | Measure the AI assistant by model cost, not by message count | 14 Oct → 16 Oct → 18 Oct | John | Omar | Enhancement · AI assistant · High · M | Done | A long chat with a transcript costs far more than a short question. Store the real cost of each reply and limit by monthly budget; show usage as a percentage. Replaces the message limit in #089. |
| 134 | Redesign the AI assistant; keep replies going when the page closes | 14 Oct → 15 Oct → 18 Oct | John | Omar | Enhancement · AI assistant · High · L | Done | Replies are made of parts and saved while streaming, so closing the tab does not lose them. Stop button, side panel and conversations list. |
| 135 | Recordings in the patient history with consultation notes | 14 Oct → 14 Oct → 18 Oct | John | Omar | Feature · Recordings · High · L | Done | Link a recording to a patient and show it in their timeline. Pro doctors get an automatic structured note in French from the transcript. |
| 136 | Name, auto-save, recover and delete recordings | 14 Oct → 14 Oct → 18 Oct | John | Omar | Enhancement · Recordings · High · M | Done | Keep the audio in IndexedDB while recording, offer recovery after a crash, allow naming and deleting. |
| 137 | Detect who is speaking in consultation transcripts | 14 Oct → 14 Oct → 18 Oct | John | Omar | Feature · Recordings · Medium · M | Done | Label each speaker as doctor, patient or companion; the doctor can correct a role. |
| 138 | The AI assistant reads the practice and proposes actions | 14 Oct → 16 Oct → 18 Oct | John | Omar | Feature · AI assistant · High · L | Code Review | Read tools for schedule, patients, slots, invoices and stats. Action tools (invoice, accept or refuse, note, appointment, reschedule) show an editable card and only run after the doctor confirms. |
| 139 | Write the full application description for the report | 14 Oct → 16 Oct → 18 Oct | Ismail | Omar | Docs · Docs · High · M | Code Review | One document with features, rules, plans, data model, AI parts and model test results, checked against the code. |
| 140 | Doctor days off and holidays in the calendar | 14 Oct → –  → – | John | Omar | Feature · Doctor · Medium · M | Backlog | The table exists but there is no screen to enter holidays. Slots must be hidden for the AI. |
| 141 | Never overwrite the phone owner's name from background capture | 15 Oct → 17 Oct → 17 Oct | John | Omar | Bug · Voice · High · S | Done | When someone else uses the phone, background capture renamed the owner. Only update the owner when the caller is the owner. |
| 142 | Lock down person routes and type doctor availability | 15 Oct → 15 Oct → 17 Oct | Omar | Omar | Chore · Web · Medium · S | Done | Require the internal secret on person routes and add types for doctor availability. |
| 143 | Seed sample documents and council numbers for demo doctors | 15 Oct → 15 Oct → 17 Oct | John | Omar | Chore · Admin · Low · S | Done | Demo doctors miss files and registration numbers, so their profile looks incomplete in the admin view. |
| 144 | Redesign the new patient form | 15 Oct → 15 Oct → 17 Oct | Ismail | Omar | Enhancement · Patients · Low · M | Done | Same fields for creation and edit, one shared component and hook. |
| 145 | Transcribe new recordings automatically in the background | 15 Oct → 17 Oct → 17 Oct | John | Omar | Enhancement · Recordings · High · M | Done | No more button. The transcript starts as soon as the audio is saved and the status is shown. |
| 146 | Redesign the recordings page around a side panel | 15 Oct → 15 Oct → 17 Oct | John | Omar | Enhancement · Recordings · Medium · M | Done | List on the left, details in a side panel. |
| 147 | Redesign the invoice PDF | 15 Oct → 15 Oct → 17 Oct | John | Omar | Enhancement · Billing · Medium · M | Done | A cleaner layout with better totals and typography. |
| 148 | Open the AI assistant from every dashboard page | 15 Oct → 15 Oct → 18 Oct | John | Omar | Feature · AI assistant · Medium · S | Done | Floating button and Ctrl+J shortcut open the assistant in a side panel that knows the current page. |
| 149 | Start a Twilio recording on every answered call | 15 Oct → 16 Oct → 18 Oct | John | Omar | Feature · Voice · High · S | Testing | Record both channels from the moment the call is answered, except for blocked callers. The webhook saves the audio. |
| 150 | Several time ranges per day in availability | 15 Oct → –  → – | John | Omar | Enhancement · Doctor · Low · S | Backlog | Doctors want a lunch break. Today a day has one From-To range. |
| 151 | AI chat crashes when a tool card arrives | 16 Oct → 16 Oct → 18 Oct | John | Omar | Bug · AI assistant · High · S | Done | The message list fails on the new part format. |
| 152 | Downgrade or cancel Pro from the app | 16 Oct → –  → – | John | Omar | Feature · Billing · Low · S | To Do | Today Pro simply expires. Add an explicit button and a confirmation message. |
| 153 | Find a TTS voice with a real Tunisian accent | 16 Oct → –  → – | John | Omar | Spike · Voice · Medium · M | Backlog | Re-test new voice models as they appear; none is both fast and natural today. |
| 154 | Add automated tests for the booking flow | 16 Oct → –  → – | Ismail | Omar | Chore · Project · Medium · L | To Do | Ismail: cover best fit, booking and plan limits with tests run on every pull request. |
