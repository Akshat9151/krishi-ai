# KhetiTak Backend Architecture and ML Readiness Report

**Audit scope:** current React frontend, FastAPI backend, SQLAlchemy/Neon data layer, deployment configuration, and model/data assets.

## 1. Executive summary

The frontend already exposes the main product surfaces:

- username/password and Google authentication
- dashboard and farmer activity
- crop recommendation
- disease scan
- weather advisory
- mandi/market prices
- fertilizer calculator
- AI agriculture assistant
- product catalog, search, cart, checkout, orders, and delivery tracking
- profile and preferences

The backend is a working monolith, but its maturity is uneven:

- **Production-capable now:** basic auth, OTP framework, Google auth endpoint, store catalog/search, COD order creation/lookup, weather integration with fallback, fertilizer dose calculation, rate limiting, logging, and migrations.
- **Functional but not ML-backed:** crop recommendation is a deterministic profile-scoring engine; disease detection is a CSV lookup by crop; AI assistant is keyword fallback plus optional local Ollama; mandi prices are frontend mock data.
- **Incomplete for a real product:** order ownership and status management, payments, live delivery/GPS, reliable activity identity, production model serving/training pipeline, disease image inference, live mandi data ingestion, and admin/operations APIs.

The immediate priority is not to add more UI. It is to create a stable domain API and data model behind every existing screen, then replace rule/mock implementations one at a time with versioned services.

## 2. Current system map

### Runtime and deployment

| Layer | Current implementation | Assessment |
|---|---|---|
| Frontend | React/Vite SPA in `frontend/src` | Ready as a client shell |
| API | FastAPI application in `main.py`, `routes.py`, `services/auth.py`, `services/store_api.py` | Suitable for modular monolith |
| Database | SQLAlchemy with SQLite fallback and Neon/Postgres production configuration | Good foundation; needs stronger migrations/constraints |
| Migrations | Alembic, one initial migration | Needs incremental migration discipline |
| Hosting | Vercel frontend, Render backend, Neon Postgres | Appropriate for current scale |
| Background jobs | None | Needed for weather/mandi sync, notifications, model jobs |
| Object storage | None | Needed for disease/soil images and user uploads |
| Observability | logging, metrics, health endpoints | Needs request IDs, error tracking, DB/job metrics |

The current backend is a **modular monolith**, not a microservice system. Keep it that way until traffic and team size justify separation.

## 3. Frontend-to-backend feature audit

| Frontend surface | Current API/data source | Current state | Backend work required |
|---|---|---|---|
| Login/register | `/auth/login`, `/auth/register` | Working and verified live | Add consistent identifier/email/phone validation, refresh-token rotation, audit events |
| OTP signup/login/reset | OTP routes in `services/auth.py` | Framework exists; delivery depends on provider configuration | Verify providers, rate limits, resend cooldown, delivery audit, cleanup job |
| Google sign-in | `/auth/google` | Endpoint exists; browser origin must be configured in Google Cloud | Validate token issuer/audience/nonce and link accounts safely |
| Dashboard | `/api/weather`, `/api/activities`, profile values from client preferences | Partly live; some profile values are local defaults | Persist farmer profile and farm records server-side |
| Crop recommendation | `/api/predict-crop` | Deterministic profile scoring using weather | Train/evaluate a real ranking model; persist input/output/model version |
| Disease scan | `/api/predict-disease` | CSV crop lookup, not image diagnosis | Add image upload, image model inference, confidence threshold, treatment knowledge base |
| Weather | `/api/weather` using Open-Meteo | Live external API with fallback values | Cache by location/time, provider abstraction, stale-data indicator, scheduled refresh |
| Mandi Bhav | Frontend `MOCK_MANDI_DATA` | Mock data; no backend source | Add mandi tables, provider ingestion, timestamp/source, freshness and fallback |
| Fertilizer calculator | Frontend calculation plus `/api/store/fertilizers/recommend` | Rules/recommendations; not a trained model | Persist soil tests and nutrient recommendation versions; add agronomy validation |
| AI assistant | `/api/ai-assistant` | Keyword fallback plus optional Ollama | Use an explicit provider adapter, safety policy, retrieval from verified knowledge, conversation persistence |
| Store catalog | `/api/store/products`, categories, search, featured, deals | Working; catalog seeded idempotently | Admin CRUD, inventory, pricing history, product validation, image management |
| Cart | `CartContext` localStorage | Client-only | Optional server cart for multi-device continuity and checkout integrity |
| Checkout/order | `/api/store/orders` | COD flow exists | Server-side price snapshot, order items table, authenticated ownership, state machine, admin fulfillment |
| Order tracking | `/api/store/orders/{order_number}` plus frontend timer/map illustration | Illustrative only; not live GPS | Shipment events, rider/location model, map provider, polling/websocket, privacy controls |
| Profile | Local preferences plus logout | Not a complete farmer profile backend | Profile/farm/soil/location endpoints and validation |

## 4. Existing domain model and required improvements

Current tables include `users`, `otp_challenges`, crop/disease/fertilizer legacy tables, `products`, `orders`, `farm_activities`, `store_products`, `product_categories`, `fertilizer_recommendations`, and `store_orders`.

### High-priority schema changes

1. **User identity**
   - Keep one canonical user ID in every domain table.
   - Replace username-based activity ownership with `user_id` foreign keys.
   - Normalize email/phone before unique constraints.
   - Add provider account table for Google and future providers.

2. **Farmer and farm**
   - `farmer_profiles(user_id, name, language, district, state, phone, email)`
   - `farms(user_id, name, area, area_unit, latitude, longitude, soil_type, primary_crop)`
   - `soil_tests(farm_id, tested_at, N, P, K, ph, organic_carbon, source)`

3. **Predictions**
   - `prediction_requests(id, user_id, farm_id, type, input_json, model_name, model_version, status, created_at)`
   - `prediction_results(id, request_id, output_json, confidence, warnings, created_at)`
   - Never overwrite historical model outputs when a model is retrained.

4. **Disease**
   - `diagnosis_images(id, user_id, object_key, crop, captured_at, checksum)`
   - `disease_diagnoses(id, image_id, disease, confidence, model_version, treatment_json, reviewed)`
   - Store image metadata and object-storage keys, not large binary files in Postgres.

5. **Mandi**
   - `market_prices(commodity, state, district, market, min_price, max_price, modal_price, currency, price_date, source, fetched_at)`
   - Unique key on `(market, commodity, price_date, source)` to make ingestion idempotent.

6. **Commerce**
   - `orders` and `store_orders` should be consolidated or clearly separated.
   - Add `order_items(order_id, product_id, sku, name_snapshot, unit_price, quantity, line_total)`.
   - Add `order_events(order_id, status, actor_id, note, created_at)`.
   - Add inventory reservation and payment fields.
   - Always calculate totals on the server from product price snapshots.

7. **Delivery**
   - `shipments(order_id, carrier, tracking_number, status, eta)`
   - `delivery_events(shipment_id, status, latitude, longitude, recorded_at)`
   - Avoid exposing precise rider/farmer coordinates unnecessarily.

## 5. ML and AI inventory

### Crop recommendation

Current implementation: `services/crop_ml_model.py` contains a tiny fallback DecisionTree trained at import time on eight hard-coded rows. The active endpoint uses `services/crop_logic.py`, which scores eight hand-authored crop profiles against soil, season, temperature, humidity, and rainfall.

**Conclusion:** this is currently a rules engine, not a production-trained recommendation model. It is acceptable as a baseline but must be labelled as advisory and not marketed as validated ML.

**Recommended training plan:**

1. Collect a versioned dataset with district, season, soil type, N/P/K/pH, weather aggregates, irrigation availability, crop, yield, and outcome.
2. Split by geography and time, not random rows only, to prevent leakage.
3. Train a multiclass ranking/recommendation model (CatBoost/LightGBM or calibrated gradient boosting).
4. Evaluate top-1/top-3 accuracy, macro-F1, calibration, and agronomist acceptance by region.
5. Keep the profile engine as a safety fallback when inputs are missing or confidence is below threshold.
6. Package preprocessing and model together, store model artifact and metadata in a registry/object store, and load a pinned version at startup.

### Disease detection

Current implementation: `services/disease_logic.py` loads `crop_disease.csv` and returns the first matching disease row for a crop. The frontend asks for crop and symptoms, but no image is sent to the backend.

**Conclusion:** there is no trained disease-image model in the current request path.

**Recommended plan:**

1. Define supported crops/diseases and collect labelled field images with regional variation.
2. Use transfer learning (MobileNet/EfficientNet) for an initial classifier.
3. Add image-quality and “unknown/out of distribution” rejection.
4. Report top-k labels, confidence, visible symptoms, and safe next steps.
5. Require human/agronomist review for low confidence or pesticide recommendations.
6. Version datasets, labels, model, and treatment content independently.

### Weather

Weather is not an ML model currently. It is an external provider integration plus deterministic advisory rules. A future forecasting model should only be introduced after collecting local historical observations and measuring against the provider baseline.

### Mandi price intelligence

Current frontend data is static mock data. First build reliable ingestion and freshness tracking. Only after that should price forecasting be considered. Forecast outputs must show date range, confidence interval, source, and “not a guaranteed price” messaging.

### Fertilizer recommendation

Current recommendations are rule/database driven. This is preferable to an unvalidated ML model for nutrient dosage. Use soil-test data and agronomist-reviewed agronomic formulas first. ML can later rank products or estimate response, but should not independently prescribe unsafe dosage.

### AI assistant

Current assistant uses local Ollama if reachable, otherwise keyword responses. The Ollama availability check happens at module import, which is fragile in a server deployment.

Recommended production design:

- provider adapter with explicit health and timeout checks
- verified agriculture knowledge retrieval (RAG) from reviewed documents
- conversation/session storage with retention policy
- prompt-injection and unsafe-advice filters
- citations/source labels for agronomy answers
- escalation path for disease, pesticide, medical, or financial-risk questions

## 6. API contract to implement

Use `/api/v1` for new contracts and keep existing routes temporarily for compatibility.

### Identity

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/otp/signup/request
POST /api/v1/auth/otp/signup/verify
POST /api/v1/auth/otp/login/request
POST /api/v1/auth/otp/login/verify
POST /api/v1/auth/password-reset/request
POST /api/v1/auth/password-reset/confirm
GET  /api/v1/me
PATCH /api/v1/me
```

### Farm and intelligence

```text
GET/POST/PATCH /api/v1/farms
POST /api/v1/farms/{farm_id}/soil-tests
POST /api/v1/predictions/crops
POST /api/v1/diagnoses/disease
POST /api/v1/diagnoses/disease/image
GET  /api/v1/weather
GET  /api/v1/markets/prices
GET  /api/v1/fertilizer-recommendations
POST /api/v1/assistant/conversations
POST /api/v1/assistant/conversations/{id}/messages
```

### Commerce and delivery

```text
GET  /api/v1/store/products
GET  /api/v1/store/categories
GET  /api/v1/store/products/{id}
POST /api/v1/cart/quote
POST /api/v1/orders
GET  /api/v1/orders
GET  /api/v1/orders/{order_number}
POST /api/v1/orders/{order_number}/cancel
GET  /api/v1/orders/{order_number}/events
```

Every endpoint must return a stable envelope or documented resource shape, include request IDs in errors, and enforce ownership for user data.

## 7. Security and reliability gaps

- Move all secrets and provider credentials to Render/Vercel secret stores; never use frontend secrets for privileged APIs.
- Validate Google tokens against issuer, audience, expiry, and nonce.
- Replace broad exception-to-string responses with safe public errors and private structured logs.
- Add database connection and external-provider timeouts to every integration.
- Add retry/backoff only for idempotent provider calls.
- Do not seed production data implicitly at every web process startup once an admin/catalog deployment job exists; make seeding a controlled idempotent release step.
- Add CSRF strategy if cookie sessions are introduced; otherwise keep bearer-token rules consistent.
- Add pagination limits, ownership checks, and rate limits to all auth, AI, upload, search, and order endpoints.
- Add automated backups, restore drills, and migration rollback/forward procedures for Neon.
- Add Sentry/OpenTelemetry or equivalent error tracing with request correlation IDs.

## 8. Recommended delivery phases

### Phase 0: Stabilize current backend (1-2 days)

- Freeze and document current API contracts.
- Add integration tests for auth, store, order, weather, crop, disease, and assistant routes.
- Add `/health/live` and `/health/ready` with database/provider status.
- Add request IDs, structured error responses, and database timeout configuration.

### Phase 1: Real farmer data (3-5 days)

- Add profile, farm, and soil-test tables/endpoints.
- Replace local-only profile defaults with server persistence.
- Change activity records from username to `user_id`.
- Add authenticated order listing and ownership checks.

### Phase 2: Commerce operations (3-5 days)

- Normalize order/order-item/event schema.
- Add server-side price snapshots and inventory validation.
- Add admin-only product, inventory, category, and order status APIs.
- Add payment provider abstraction; keep COD as a tested provider.

### Phase 3: Data integrations (5-8 days)

- Add cached weather service with provider status.
- Implement mandi ingestion, source tracking, freshness, and fallback.
- Add scheduled job runner and monitoring.

### Phase 4: ML productionization (1-2 weeks)

- Build data contracts, training notebooks/scripts, evaluation reports, and model registry.
- Ship crop model behind a versioned inference adapter.
- Add disease image upload/inference only after data and safety review.
- Track model latency, confidence, drift, and user feedback.

### Phase 5: AI assistant productionization (1 week)

- Provider adapter, RAG knowledge base, safety rules, conversation persistence, and evaluation set.
- Measure answer groundedness, relevance, unsafe-advice rate, latency, and cost.

## 9. Definition of done

The backend should be considered production-ready when:

1. Every frontend screen uses a documented backend contract or is explicitly labelled as local-only.
2. No business-critical data is stored only in localStorage.
3. Orders, prices, inventory, and delivery statuses are server-authoritative.
4. Every prediction stores input, output, model version, confidence, and timestamp.
5. Crop and disease claims have offline evaluation metrics and a safe fallback.
6. Mandi and weather data expose source and freshness.
7. Auth, ownership, rate limiting, secrets, migrations, backups, and observability are tested.
8. CI runs unit, API integration, migration, and frontend build checks before deployment.

## 10. Immediate next actions

1. Keep the current modular monolith; do not split services yet.
2. Implement profile/farm/soil tables and replace username-scoped activity.
3. Normalize order tables and add authenticated order ownership/events.
4. Move mandi mock data to a backend provider/ingestion boundary.
5. Add model versioning and evaluation before claiming crop/disease ML.
6. Add a real disease-image pipeline only after dataset and agronomist review.
7. Add integration tests and deployment smoke tests for every frontend API call.
