pipeline {
    agent any
    tools {
        nodejs "node18"
    }

    parameters {
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'addProduct', 'cartVerify', 'checkout', 'endToEnd'],
            description: 'Select which test suite to run'
        )
    }

    environment {
        // Cache Playwright browsers in a persistent folder inside workspace
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}\\.playwright"
        PLAYWRIGHT_DOWNLOAD_TIMEOUT = "600000" // 10 min timeout for downloads
    }

    stages {

        stage('Verify NodeJS') {
            steps {
                bat 'node -v'
                bat 'npm -v'
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/Rohini010/PlayWrightAIWrapper.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install npm packages
                bat 'npm install'

                // Only install Playwright browsers if not present
                script {
                    if (!fileExists("${env.PLAYWRIGHT_BROWSERS_PATH}/chromium-1400")) {
                        echo "Playwright browsers not found. Downloading..."
                        bat 'npx playwright install --force --quiet'
                    } else {
                        echo "Playwright browsers already downloaded. Skipping download."
                    }
                }
            }
        }

        stage('Clean Reports') {
            steps {
                bat 'npm run clean'
            }
        }

        stage('Prepare Allure') {
            steps {
                bat 'npx allure --version'
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    switch(params.TEST_SUITE) {
                        case 'all':
                            bat 'npm run test:all'
                            break
                        case 'addProduct':
                            bat 'npm run test:addProduct'
                            break
                        case 'cartVerify':
                            bat 'npm run test:cartVerify'
                            break
                        case 'checkout':
                            bat 'npm run test:checkout'
                            break
                        case 'endToEnd':
                            bat 'npm run test:endToEnd'
                            break
                    }
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                bat 'npm run allure:generate'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true

            allure([
                reportBuildPolicy: 'ALWAYS',
                includeProperties: false,
                jdk: '',
                results: [[path: 'allure-results']]
            ])
        }
    }
}
