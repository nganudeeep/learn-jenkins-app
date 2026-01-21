pipeline {
    agent any

    environment{
        NETLIFY_SITE_ID = 'a74eaa08-aa7e-4463-bff5-5ec973cace14'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
    }

    stages { 
        stage('Build') {
            agent{
                docker{
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
               sh '''
               ls -la
               node --version
               npm --version
               npm ci
               npm run build
               ls -la
               '''
            }
        } 
    

        stage('Test'){
            parallel{
                stage('unit test'){
                        agent{
                            docker{
                                image 'node:18-alpine'
                                reuseNode true
                            }
                        }
                        steps{
                            sh '''
                            test -f build/index.html
                            npm test
                            '''
                        }
                        
                    }
                    stage('E2E test'){
                        agent{
                            docker{
                                image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
                                reuseNode true
                            }
                        }
                        steps{
                            sh '''
                            npm install serve
                            node_modules/.bin/serve -s build &
                            #sleep 5
                            npx playwright test --reporter=html
                            '''
                        }

                        post {
                            always{
                                junit 'jest-results/junit.xml'
                                publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, icon: '', keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright Local', reportTitles: '', useWrapperFileDirectly: true])
                            }
                        }
                    }            
                }
        }


        stage('Deploy Staging') {
            agent{
                docker{
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
               sh '''
               npm install netlify-cli@20.1.1 node-jq
               node_modules/.bin/netlify --version
               echo "Deploying to Staging Site ID: $NETLIFY_SITE_ID"
               node_modules/.bin/netlify status
               node_modules/.bin/netlify deploy --dir=build --json > deploy-output.json             #this is the only difference b/w Deploy Staging and Deploy Prod
               node_modules/.bin/node-jq -r '.deploy_url' deploy-output.json                        # install Jq tool , use that .son file for the details and parse the details
               '''
                script{
                    env.STAGING_URL = sh(script:"node_modules/.bin/node-jq -r '.deploy_url' deploy-output.json", returnStdout: true)
                }
            }
        }

        stage('Staging E2E'){
            agent{
                docker{
                    image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
                    reuseNode true
                }
            }

            environment{
                CI_ENVIRONMENT_URL = "${env.STAGING_URL}"       #use double_quote to make accessable
            }

            steps{
                sh '''
                npx playwright test --reporter=html
                '''
            }

            post {
                always{
                    junit 'jest-results/junit.xml'
                    publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, icon: '', keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Staging E2E', reportTitles: '', useWrapperFileDirectly: true])
                }
            }
        }  

        // stage('Approval'){
        //     steps{
        //          timeout(time: 15, unit: 'MINUTES'){
        //              input message: 'Do you wish to Deploy to Production?', ok: 'Yes, I am Sure!'
        //         }
        //     }
        // }
    
        stage('Deploy Prod') {
            agent{
                docker{
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
               sh '''
               npm install netlify-cli@20.1.1
               node_modules/.bin/netlify --version
               echo "Deploying to production Site ID: $NETLIFY_SITE_ID"
               node_modules/.bin/netlify status
               node_modules/.bin/netlify deploy --dir=build --prod
               '''
            }
        }

        
        stage('Prod E2E'){
            agent{
                docker{
                    image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
                    reuseNode true
                }
            }

            environment{
                CI_ENVIRONMENT_URL = 'https://endearing-empanada-2950a5.netlify.app'
            }

            steps{
                sh '''
                npx playwright test --reporter=html
                '''
            }

            post {
                always{
                    junit 'jest-results/junit.xml'
                    publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, icon: '', keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Prod E2E', reportTitles: '', useWrapperFileDirectly: true])
                }
            }
        }  
    }
}
//end of file