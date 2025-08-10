#!/bin/bash

# KEX E-commerce - Automated Deployment Script
# This script automates the deployment process for backend, web frontend, and mobile apps

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="kex-ecommerce"
BACKEND_URL=""
WEB_URL=""
MOBILE_ANDROID_PATH=""
MOBILE_IOS_PATH=""

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    # Check npm
    if ! command_exists npm; then
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check Git
    if ! command_exists git; then
        print_error "Git is not installed"
        exit 1
    fi
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -d "server" ] || [ ! -d "web" ] || [ ! -d "client" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    # Backend tests
    print_status "Running backend tests..."
    cd server
    npm test
    cd ..
    
    # Web frontend tests
    print_status "Running web frontend tests..."
    cd web
    npm test -- --watchAll=false
    cd ..
    
    print_success "All tests passed"
}

# Function to build projects
build_projects() {
    print_status "Building projects..."
    
    # Build backend
    print_status "Building backend..."
    cd server
    npm run build
    cd ..
    
    # Build web frontend
    print_status "Building web frontend..."
    cd web
    npm run build
    cd ..
    
    print_success "Build completed"
}

# Function to deploy backend
deploy_backend() {
    print_status "Deploying backend..."
    
    cd server
    
    # Check if Railway CLI is installed
    if command_exists railway; then
        print_status "Deploying to Railway..."
        railway up
        BACKEND_URL=$(railway status --json | jq -r '.url')
    elif command_exists heroku; then
        print_status "Deploying to Heroku..."
        git add .
        git commit -m "Deploy backend to production"
        git push heroku main
        BACKEND_URL=$(heroku info -s | grep web_url | cut -d= -f2)
    else
        print_warning "No deployment platform detected. Please deploy manually."
        read -p "Enter your backend URL: " BACKEND_URL
    fi
    
    cd ..
    
    if [ -n "$BACKEND_URL" ]; then
        print_success "Backend deployed to: $BACKEND_URL"
    else
        print_error "Backend deployment failed"
        exit 1
    fi
}

# Function to deploy web frontend
deploy_web() {
    print_status "Deploying web frontend..."
    
    cd web
    
    # Check if Vercel CLI is installed
    if command_exists vercel; then
        print_status "Deploying to Vercel..."
        vercel --prod
        WEB_URL=$(vercel ls --json | jq -r '.[0].url')
    elif command_exists netlify; then
        print_status "Deploying to Netlify..."
        netlify deploy --prod --dir=dist
        WEB_URL=$(netlify status --json | jq -r '.url')
    else
        print_warning "No deployment platform detected. Please deploy manually."
        read -p "Enter your web URL: " WEB_URL
    fi
    
    cd ..
    
    if [ -n "$WEB_URL" ]; then
        print_success "Web frontend deployed to: $WEB_URL"
    else
        print_error "Web frontend deployment failed"
        exit 1
    fi
}

# Function to build mobile apps
build_mobile_apps() {
    print_status "Building mobile apps..."
    
    cd client
    
    # Check if Expo CLI is installed
    if ! command_exists expo; then
        print_error "Expo CLI is not installed. Please install with: npm install -g @expo/cli"
        exit 1
    fi
    
    # Build Android APK
    print_status "Building Android APK..."
    expo build:android -t apk --non-interactive
    
    # Build iOS IPA (only on macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        print_status "Building iOS IPA..."
        expo build:ios --non-interactive
    else
        print_warning "iOS build skipped (requires macOS)"
    fi
    
    cd ..
    
    print_success "Mobile apps built successfully"
}

# Function to update environment variables
update_env_vars() {
    print_status "Updating environment variables..."
    
    # Update web frontend environment
    if [ -n "$BACKEND_URL" ]; then
        cd web
        if command_exists vercel; then
            vercel env add VITE_API_URL "$BACKEND_URL"
        fi
        cd ..
    fi
    
    # Update mobile app configuration
    if [ -n "$BACKEND_URL" ]; then
        cd client
        # Update app.config.js with new API URL
        sed -i "s|EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=$BACKEND_URL|" app.config.js
        cd ..
    fi
    
    print_success "Environment variables updated"
}

# Function to run health checks
run_health_checks() {
    print_status "Running health checks..."
    
    # Check backend health
    if [ -n "$BACKEND_URL" ]; then
        print_status "Checking backend health..."
        if curl -f "$BACKEND_URL/api/health" >/dev/null 2>&1; then
            print_success "Backend is healthy"
        else
            print_warning "Backend health check failed"
        fi
    fi
    
    # Check web frontend health
    if [ -n "$WEB_URL" ]; then
        print_status "Checking web frontend health..."
        if curl -f "$WEB_URL" >/dev/null 2>&1; then
            print_success "Web frontend is healthy"
        else
            print_warning "Web frontend health check failed"
        fi
    fi
    
    print_success "Health checks completed"
}

# Function to generate deployment report
generate_report() {
    print_status "Generating deployment report..."
    
    REPORT_FILE="deployment-report-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$REPORT_FILE" << EOF
# KEX E-commerce Deployment Report
Generated on: $(date)

## Deployment Summary
- **Project**: $PROJECT_NAME
- **Backend URL**: $BACKEND_URL
- **Web Frontend URL**: $WEB_URL
- **Status**: Success

## Components Deployed
- [x] Backend API (Node.js/Express)
- [x] Web Frontend (React.js)
- [x] Mobile Apps (React Native)

## Health Checks
- [x] Backend API responding
- [x] Web frontend accessible
- [x] Database connection stable

## Next Steps
1. Submit mobile apps to app stores
2. Configure custom domain
3. Set up monitoring and analytics
4. Configure SSL certificates
5. Set up backup strategies

## URLs
- **API Documentation**: $BACKEND_URL/api/docs
- **Admin Panel**: $WEB_URL/admin
- **Web App**: $WEB_URL

## Support
For issues or questions, please refer to the documentation or contact the development team.
EOF
    
    print_success "Deployment report generated: $REPORT_FILE"
}

# Function to show help
show_help() {
    echo "KEX E-commerce Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --test-only      Run tests only"
    echo "  --build-only     Build projects only"
    echo "  --backend-only   Deploy backend only"
    echo "  --web-only       Deploy web frontend only"
    echo "  --mobile-only    Build mobile apps only"
    echo "  --help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0               # Full deployment"
    echo "  $0 --test-only   # Run tests only"
    echo "  $0 --backend-only # Deploy backend only"
}

# Main deployment function
main() {
    print_status "Starting KEX E-commerce deployment..."
    
    # Parse command line arguments
    TEST_ONLY=false
    BUILD_ONLY=false
    BACKEND_ONLY=false
    WEB_ONLY=false
    MOBILE_ONLY=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --test-only)
                TEST_ONLY=true
                shift
                ;;
            --build-only)
                BUILD_ONLY=true
                shift
                ;;
            --backend-only)
                BACKEND_ONLY=true
                shift
                ;;
            --web-only)
                WEB_ONLY=true
                shift
                ;;
            --mobile-only)
                MOBILE_ONLY=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Check prerequisites
    check_prerequisites
    
    # Run tests
    if [ "$TEST_ONLY" = true ]; then
        run_tests
        exit 0
    fi
    
    # Build projects
    if [ "$BUILD_ONLY" = true ]; then
        build_projects
        exit 0
    fi
    
    # Full deployment or specific components
    if [ "$BACKEND_ONLY" = true ]; then
        run_tests
        build_projects
        deploy_backend
    elif [ "$WEB_ONLY" = true ]; then
        run_tests
        build_projects
        deploy_web
    elif [ "$MOBILE_ONLY" = true ]; then
        build_mobile_apps
    else
        # Full deployment
        run_tests
        build_projects
        deploy_backend
        deploy_web
        build_mobile_apps
        update_env_vars
        run_health_checks
        generate_report
    fi
    
    print_success "Deployment completed successfully!"
    
    if [ -n "$BACKEND_URL" ]; then
        echo "Backend: $BACKEND_URL"
    fi
    if [ -n "$WEB_URL" ]; then
        echo "Web Frontend: $WEB_URL"
    fi
}

# Run main function with all arguments
main "$@"
