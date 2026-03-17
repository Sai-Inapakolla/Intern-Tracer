# Internship Tracker Frontend (Angular)

This project is an Internship Tracker frontend built with Angular and integrated with a Node.js + Express + MongoDB backend.

## Experiment Objectives

- Understand the concept of Single Page Applications (SPA) and how Angular builds dynamic web applications.
- Learn Angular component-based architecture for scalable front-end development.
- Design and implement the frontend interface for an internship tracking system.
- Use Angular components, templates, and services to manage UI and application logic.
- Implement Angular routing to navigate between pages without reloading.
- Integrate Angular with a Node.js and Express REST API to fetch and manipulate internship application data stored in MongoDB.
- Demonstrate client-side rendering and dynamic data binding in an Angular SPA.

## Implemented Components

- `NavbarComponent` for app-level navigation.
- `ViewApplicationsComponent` to display internship applications by status.
- `AddApplicationComponent` to create a new internship application.
- `UpdateApplicationComponent` to edit an existing internship application.

## Frontend Routes

- `/applications` - View all internship applications
- `/create` - Add a new internship application
- `/update/:id` - Update an existing internship application

## API Integration

The Angular application service connects to:

- `http://localhost:3000/api/applications`

Supported operations:

- `GET /api/applications`
- `GET /api/applications/:id`
- `POST /api/applications`
- `PUT /api/applications/:id`
- `DELETE /api/applications/:id`

## Run the Frontend

From the `frontend` folder:

```bash
npm install
npm start
```

Then open `http://localhost:4200`.

## After Completing This Experiment, Students Will Be Able To

- Understand the concept and advantages of Single Page Applications (SPA).
- Create and configure an Angular application using Angular CLI.
- Develop modular UI components such as header, navigation bar, and application management pages.
- Implement Angular routing for navigation within the application without reloading the page.
- Use Angular services and HttpClient to connect the frontend with a backend REST API.
- Perform CRUD operations (Create, Read, Update, Delete) on internship application data through the Angular interface.
- Integrate Angular with Node.js, Express, and MongoDB to build a complete full-stack application.
