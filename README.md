# CourseMaster 

CourseMaster is the React-based client application for the CourseMaster platform. It allows users to browse and purchase courses, manage their profile, and access the dashboard. Admins can manage courses and view user data.

**Live Demo:** [https://courseemaster.netlify.app](https://courseemaster.netlify.app)  
**Admin Access:**  Password: `Admin8899.`

---

## Features

- User Registration & Login
- JWT-based authentication
- User dashboard with purchased courses
- Admin dashboard with course and user management
- Stripe payment integration
- Responsive UI with Tailwind CSS and DaisyUI
- Image upload via ImgBB

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Sadia126/coursemaster
cd coursemaster
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_IMGBB_KEY=<your_imgbb_api_key>
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser at [http://localhost:5173](http://localhost:5173)

---

## Environment Variables

| Variable            | Description                                                                   |
| ------------------- | ----------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | URL of the backend API (e.g., [http://localhost:5000](http://localhost:5000)) |
| `VITE_IMGBB_KEY`    | API key for ImgBB image uploads                                               |

---

## Project Structure

```
src/
├── components/        # Shared components like Navbar, Loading, etc.
├── pages/             # All page components (Home, Dashboard, Course Details)
├── hooks/             # Custom React hooks (useAuth, etc.)
├── utils/             # Utility functions (axios instances, helpers)
├── App.jsx            # Main app component
└── main.jsx           # Entry point
```

---

## API Integration

The frontend interacts with the backend using the following base URL:

```
VITE_API_BASE_URL
```

### Auth Endpoints

* `POST /api/register` – Register a new user
* `POST /api/login` – Login
* `POST /api/logout` – Logout
* `GET /api/me` – Get current logged-in user

### Course & Payment Endpoints

* `POST /api/create-checkout-session` – Create Stripe checkout session
* `GET /api/session/:id` – Get Stripe session status
* Other course endpoints: `/api/courses`, `/api/courses/:id`

---

## Admin Access

* Admin email/username: Admin
* Password: `Admin8899`
* Admin dashboard available at `/dashboard/admin` after login

---

## Technologies Used

* React.js & React Router
* Tailwind CSS & DaisyUI
* Axios for API calls
* Stripe API for payments
* ImgBB for image uploads
* React Hot Toast for notifications


