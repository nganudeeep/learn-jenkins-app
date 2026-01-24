pipeline {
    agent any

    environment{
        NETLIFY_SITE_ID = 'a74eaa08-aa7e-4463-bff5-5ec973cace14'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
    }

    stages {

        stage('AWS'){
            agent{
                docker{
                    image 'amazon/aws-cli'
                    reuseNode true
                    args "--entrypoint=''"
                }
            }
            steps{
                withCredentials([usernamePassword(credentialsId: 'my-aws', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                sh '''
                    aws --version
                    aws s3 ls
                    aws iam list-users
                '''
                }
            }
        }
    }
}
'''
        stage('Build') {
            agent{
                docker{
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
               sh '''
               //ls -la
               //node --version
               //npm --version
               //npm ci
               //npm run build
               //ls -la
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
                            // test -f build/index.html
                            // npm test
                            '''
                        }
                        
                    }
                    stage('E2E test'){
                        agent{
                            docker{
                                image 'my-playwright'
                                reuseNode true
                            }
                        }
                        steps{
                            sh '''
                            // serve -s build &
                            // #sleep 5
                            // npx playwright test --reporter=html
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


        stage('Deploy Staging'){
            agent{
                docker{
                    image 'my-playwright'
                    reuseNode true
                }
            }

            environment{
                CI_ENVIRONMENT_URL = 'Staging_URL_to_be_set'
            }

            steps{
                sh '''
                // netlify --version
                // echo "Deploying to Staging Site ID: $NETLIFY_SITE_ID"
                // netlify status
                // netlify deploy --dir=build --json > deploy-output.json
                // CI_ENVIRONMENT_URL=$(jq -r '.deploy_url' deploy-output.json)  
                // npx playwright test --reporter=html
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
        
        stage('Deploy Prod'){
            agent{
                docker{
                    image 'my-playwright'
                    reuseNode true
                }
            }

            environment{
                CI_ENVIRONMENT_URL = 'https://endearing-empanada-2950a5.netlify.app'
            }

            steps{
                sh '''
                // node --version
                // netlify --version
                // echo "Deploying to production Site ID: $NETLIFY_SITE_ID"
                // netlify status
                // netlify deploy --dir=build --prod
                // npx playwright test --reporter=html
                '''
            }

            post {
                always{
                    junit 'jest-results/junit.xml'
                    publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, icon: '', keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Prod E2E', reportTitles: '', useWrapperFileDirectly: true])
                }
            }
        } '''  
    

//end of file