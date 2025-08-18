pipeline {
    agent any
    environment {
        BUILD_PYTHON = 'true'
        BUILD_REACT = 'true'
        BUILD_SPRING = 'true'
        DOPPLER_TOKEN = credentials('jenkins-doppler-service-token')
    }
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/amits781/home_iot.git', branch: 'main'
            }
        }

        stage('Python - Generate newrelic.ini') {
            when { expression { env.BUILD_PYTHON == 'true' } }
            steps {
                dir('python_iot') {
                    sh '''
                        doppler run -- bash -c '
                            envsubst < newrelic_template.ini > newrelic.ini
                        '
                    '''
                }
            }
        }

        stage('Python - Build Docker Image') {
            when { expression { env.BUILD_PYTHON == 'true' } }
            steps {
                dir('python_iot') {
                    sh '''
                        doppler run -- bash -c '
                            docker build --no-cache -t python-iot-device:latest .
                        '
                    '''
                }
            }
        }

        stage('React - Build Docker Image') {
            when { expression { env.BUILD_REACT == 'true' } }
            steps {
                dir('react_app') {
                    sh '''
                        doppler run -- bash -c '
                            docker build \
                                --build-arg REACT_APP_PIXBAY_KEY="$REACT_APP_PIXBAY_KEY" \
                                --build-arg REACT_APP_CLERK_PUBLISHABLE_KEY="$REACT_APP_CLERK_PUBLISHABLE_KEY" \
                                --build-arg REACT_APP_HOST_URL="$REACT_APP_HOST_URL" \
                                -t react-iot:latest .
                        '
                    '''
                }
            }
        }

        stage('Spring - Generate newrelic.yml') {
            when { expression { env.BUILD_SPRING == 'true' } }
            steps {
                dir('spring_boot_service/newrelic') {
                    sh '''
                        doppler run -- bash -c '
                            envsubst < newrelic_template.yml > newrelic.yml
                        '
                    '''
                }
            }
        }

        stage('Spring - Build Docker Image') {
            when { expression { env.BUILD_SPRING == 'true' } }
            steps {
                dir('spring_boot_service') {
                    sh '''
                        doppler run -- bash -c '
                            docker build --no-cache -t spring-boot-iot:latest .
                        '
                    '''
                }
            }
        }

        stage('Cleanup Spring Boot App Existing Container') {
            when { expression { env.BUILD_SPRING == 'true' } }
            steps {
                sh '''
                    existing_container=$(docker ps -aq -f name=iot-spring-boot)
                    if [ ! -z "$existing_container" ]; then
                        docker rm -f $existing_container
                    fi
                '''
            }
        }

        stage('Run Spring Boot Docker Container') {
            when { expression { env.BUILD_SPRING == 'true' } }
            steps {
                sh '''
                    doppler run -- bash -c '
                        docker run \
                            -d \
                            --network iotnet \
                            --name iot-spring-boot \
                            --restart unless-stopped \
                            -e ISS_URI="$SPRING_APP_ISS_URI" \
                            -e JWK_URI="$SPRING_APP_JWK_URI" \
                            -e MYSQL_HOST="$SPRING_APP_MYSQL_HOST" \
                            -e MYSQL_PORT="$SPRING_APP_MYSQL_PORT" \
                            -e DATABASE="$SPRING_APP_DATABASE" \
                            -e DB_USER="$SPRING_APP_DB_USER" \
                            -e DB_PASSWORD="$SPRING_APP_DB_PASSWORD" \
                            -e EMAIL_PASSWORD="$SPRING_APP_EMAIL_PASSWORD" \
                            -e SENDER_EMAIL="$SPRING_APP_SENDER_EMAIL_ID" \
                            -e SECRET_KEY="$SPRING_APP_SECRET_KEY" \
                            -p 8080:8080 \
                            spring-boot-iot:latest
                    '
                '''
            }
        }
        
        stage('Cleanup Existing React App Container') {
            when { expression { env.BUILD_REACT == 'true' } }
            steps {
                sh '''
                    existing_container=$(docker ps -aq -f name=iot-react)
                    if [ ! -z "$existing_container" ]; then
                        docker rm -f $existing_container
                    fi
                '''
            }
        }

        stage('Run React App Docker Container') {
            when { expression { env.BUILD_REACT == 'true' } }
            steps {
                sh '''
                    doppler run -- bash -c '
                        docker run \
                            -d \
                            --restart unless-stopped \
                            --network iotnet \
                            --name iot-react \
                            -e NEW_RELIC_LICENSE_KEY="$REACT_APP_NEW_RELIC_LICENSE_KEY" \
                            -e NEW_RELIC_APP_NAME="$REACT_APP_NEW_RELIC_APP_NAME" \
                            -p 3000:3000 \
                            react-iot:latest
                    '
                '''
            }
        }


        stage('Cleanup Existing Python IOT Container') {
            when { expression { env.BUILD_PYTHON == 'true' } }
            steps {
                sh '''
                    existing_container=$(docker ps -aq -f name=python-sinric-device)
                    if [ ! -z "$existing_container" ]; then
                        docker rm -f $existing_container
                    fi
                '''
            }
        }
        
        
        stage('Run Python IOT Docker Container') {
            when { expression { env.BUILD_PYTHON == 'true' } }
            steps {
                sh '''
                    doppler run -- bash -c '
                        docker run \
                            --network iotnet \
                            --restart unless-stopped \
                            -d \
                            --name python-sinric-device \
                            -e APP_KEY="$PYTHON_APP_KEY" \
                            -e APP_SECRET="$PYTHON_APP_SECRET" \
                            -e SWITCH_ID="$PYTHON_SWITCH_ID" \
                            -e URL="$PYTHON_SPRING_URL" \
                            python-iot-device:latest
                    '
                '''
            }
        }
    }
    post {
        always {
            echo 'All sequential services deployed.'
        }
    }
}
