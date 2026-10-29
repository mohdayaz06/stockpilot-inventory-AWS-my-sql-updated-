StockPilot Inventory Management System
End-to-End DevOps & GitOps Project on AWS EKS

A production-style inventory management application deployed on Amazon EKS with a complete CI/CD and GitOps pipeline using Jenkins, Argo CD, Docker, Kubernetes, AWS ALB Ingress, Prometheus, and Grafana.

Project Overview:

This project demonstrates a complete DevOps lifecycle from source code commit to production deployment on Amazon EKS.

The application is automatically built, scanned, containerized, deployed, and monitored using modern DevOps tools and GitOps practices.

Architecture:

<img width="1600" height="1180" alt="image" src="https://github.com/user-attachments/assets/5addeb48-0325-4f29-ad69-7a425472a914" />

Tech Stack
 Category | Technology |
|----------|------------|
| ☁️ Cloud | AWS |
| 🐳 Containerization | Docker |
| ☸️ Container Orchestration | Kubernetes (Amazon EKS) |
| 🏗️ Infrastructure as Code | Terraform |
| 🔄 CI | Jenkins | 
| 🚀 GitOps | Argo CD |
| 📦 Container Registry | Docker Hub |
| 🔍 Code Quality | SonarQube |
| 🛡️ Security Scanning | Trivy |
| 📊 Monitoring | Prometheus |
| 📈 Visualization | Grafana |
| 🗄️ Database | MongoDB |
| 🌐 Load Balancer | AWS Application Load Balancer (ALB) |
| 🔀 Networking | Kubernetes Ingress |

## 🔄 CI/CD Pipeline

The Jenkins pipeline performs the following stages:

- Checkout Source Code
- Install Dependencies
- SonarQube Code Analysis
- Build Docker Image
- Trivy Vulnerability Scan
- Push Docker Image to Docker Hub
- Update Kubernetes Manifests
- Push Changes to GitHub
- Argo CD Detects Changes
- Automatic Deployment to Amazon EKS

<img width="1415" height="435" alt="jenkins_stages_cropped" src="https://github.com/user-attachments/assets/8e93ae6a-14c6-4c80-a42a-58e19d4105b2" />

## GitOps Workflow (Argo CD)

Argo CD continuously watches the Kubernetes manifests stored in the GitHub repository.

Whenever Jenkins updates the deployment manifests:

- Argo CD detects the new Git commit.
- Synchronizes the desired state with the Kubernetes cluster.
- Deploys the latest application to Amazon EKS.
- Automatically reconciles any configuration drift (Self-Healing).
- Ensures the cluster state always matches the Git repository.

<img width="1915" height="982" alt="ad44fd33-0080-4210-81ad-b70ed496c8f8" src="https://github.com/user-attachments/assets/a6613272-e60e-4d85-82ed-9ec7349fc041" />


## Kubernetes Architecture

The application is deployed on an Amazon EKS cluster with the following components:

- AWS Application Load Balancer (ALB) exposes the application to users.
- Kubernetes Ingress routes incoming traffic to the appropriate services.
- Frontend Service forwards requests to the Frontend Pods.
- Backend Service forwards API requests to the Backend Pods.
- Backend Pods communicate with MongoDB for data storage.
- Prometheus collects metrics from the Kubernetes cluster and application.
- Grafana visualizes metrics through dashboards for monitoring and observability.

<img width="1920" height="1080" alt="09de8073-3bc9-4883-8dc7-c0ca86dbe19b" src="https://github.com/user-attachments/assets/f48f4e67-5f7c-46b9-bc7d-cc9c78f8e820" />

<img width="1920" height="1080" alt="1fbcef0e-fd66-4368-a598-85ab700f21d8" src="https://github.com/user-attachments/assets/81bf5bd6-33e5-4648-a926-cf68527e1132" />

<img width="1910" height="962" alt="bc498f4d-3e5d-47b0-8024-8cdda18cb19a" src="https://github.com/user-attachments/assets/b31ae2e1-25e0-43d6-9efa-5c271e4d8519" />

## 🌐 StockPilot Inventory Management System

The following screenshots demonstrate the user interface of the application running on Amazon EKS.

### Login Page

<img width="1920" height="1080" alt="0002db1a-eb13-48f0-adf6-eca2c375c5b8" src="https://github.com/user-attachments/assets/6591d2ab-f4ce-4b30-b0c9-b2e5505cf67b" />


### Dashboard

<img width="1920" height="1080" alt="ad26e0b8-6c65-4661-a6b6-b36f2cf1ed59" src="https://github.com/user-attachments/assets/773de497-356d-452e-a49e-83f76400878d" />



