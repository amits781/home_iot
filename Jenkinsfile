pipeline {
    agent any

    environment {
        BUILD_PYTHON = 'true'
        BUILD_REACT = 'false'
        BUILD_SPRING = 'false'

        // Inject all credentials as environment variables globally
        NEW_RELIC_KEY = credentials('PYTHON_NEW_RELIC_KEY_CRED')
        PYTHON_APP_KEY = credentials('PYTHON_APP_KEY')
        PYTHON_APP_SECRET = credentials('PYTHON_APP_SECRET')
        PYTHON_SWITCH_ID = credentials('PYTHON_SWITCH_ID')
        PYTHON_SPRING_URL = credentials('PYTHON_SPRING_URL')

        REACT_APP_PIXBAY_KEY = credentials('REACT_APP_PIXBAY_KEY')
        REACT_APP_CLERK_PUBLISHABLE_KEY = credentials('REACT_APP_CLERK_PUBLISHABLE_KEY')
        REACT_APP_HOST_URL = credentials('REACT_APP_HOST_URL')
        REACT_NEW_RELIC_LICENSE_KEY = credentials('REACT_APP_NEW_RELIC_LICENSE_KEY')
        REACT_NEW_RELIC_APP_NAME = credentials('REACT_APP_NEW_RELIC_APP_NAME')


        SPRING_NEW_RELIC_KEY = credentials('SPRING_APP_NEW_RELIC_KEY')
        ISS_URI = credentials('SPRING_APP_ISS_URI')
        JWK_URI = credentials('SPRING_APP_JWK_URI')
        DATABASE = credentials('SPRING_APP_DATABASE')
        DB_USER = credentials('SPRING_APP_DB_USER')
        DB_PASSWORD = credentials('SPRING_APP_DB_PASSWORD')
        EMAIL_PASSWORD = credentials('SPRING_APP_EMAIL_PASSWORD')
        SENDER_EMAIL = credentials('SPRING_APP_SENDER_EMAIL_ID')
        SECRET_KEY = credentials('SPRING_APP_SECRET_KEY')
        MYSQL_HOST = credentials('SPRING_APP_MYSQL_HOST')
        MYSQL_PORT = credentials('SPRING_APP_MYSQL_PORT')   
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/amits781/home_iot.git', branch: 'main'
            }
        }

        stage('Python - Generate newrelic.ini') {
            when {
                expression { env.BUILD_PYTHON == 'true' }
            }
            steps {
                dir('python_iot') {
                    sh '''
                        export PYTHON_NEW_RELIC_LICENSE_KEY="$NEW_RELIC_KEY"
                        envsubst < newrelic_template.ini > newrelic.ini
                    '''
                }
            }
        }

        stage('Python - Build Docker Image') {
            when {
                expression { env.BUILD_PYTHON == 'true' }
            }
            steps {
                dir('python_iot') {
                    script {
                        docker.build("python-iot-device:latest", "--no-cache .")
                    }
                }
            }
        }

        stage('React - Build Docker Image') {
            when {
                expression { env.BUILD_REACT == 'true' }
            }
            steps {
                dir('react_app') {
                    script {
                        def buildArgs = "--build-arg REACT_APP_PIXBAY_KEY=$REACT_APP_PIXBAY_KEY " +
                                        "--build-arg REACT_APP_CLERK_PUBLISHABLE_KEY=$REACT_APP_CLERK_PUBLISHABLE_KEY " +
                                        "--build-arg REACT_APP_HOST_URL=$REACT_APP_HOST_URL ."
                        docker.build("react-iot:latest", buildArgs)
                    }
                }
            }
        }

        stage('Spring - Generate newrelic.yml') {
            when {
                expression { env.BUILD_SPRING == 'true' }
            }
            steps {
                dir('spring_boot_service/newrelic') {
                    sh '''
                        export NEW_RELIC_LICENSE_KEY="$SPRING_NEW_RELIC_KEY"
                        envsubst < newrelic_template.yml > newrelic.yml
                    '''
                }
            }
        }

        stage('Spring - Build Docker Image') {
            when {
                expression { env.BUILD_SPRING == 'true' }
            }
            steps {
                dir('spring_boot_service') {
                    script {
                        docker.build("spring-boot-iot:latest", "--no-cache .")
                    }
                }
            }
        }

        stage('Cleanup Spring Boot App Existing Container') {
            when {
                expression { env.BUILD_SPRING == 'true' }
            }
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
            when {
                expression { env.BUILD_SPRING == 'true' }
            }
            steps {
                sh '''
                    docker run \\
                        -d \\
                        --network iotnet \\
                        --name iot-spring-boot \\
                        --restart unless-stopped \\
                        -e ISS_URI='$ISS_URI' \\
                        -e JWK_URI='$JWK_URI' \\
                        -e MYSQL_HOST='$MYSQL_HOST' \\
                        -e MYSQL_PORT='$MYSQL_PORT' \\
                        -e DATABASE='$DATABASE' \\
                        -e DB_USER='$DB_USER' \\
                        -e DB_PASSWORD='$DB_PASSWORD' \\
                        -e EMAIL_PASSWORD='$EMAIL_PASSWORD' \\
                        -e SENDER_EMAIL='$SENDER_EMAIL' \\
                        -e SECRET_KEY='$SECRET_KEY' \\
                        -p 8080:8080 \\
                        spring-boot-iot:latest
                '''
            }
        }

        stage('Cleanup Existing React App Container') {
            when {
                expression { env.BUILD_REACT == 'true' }
            }
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
            when {
                expression { env.BUILD_REACT == 'true' }
            }
            steps {
                sh '''
                    docker run \\
                        -d \\
                        --restart unless-stopped \\
                        --network iotnet \\
                        --name iot-react \\
                        -e NEW_RELIC_LICENSE_KEY='$REACT_NEW_RELIC_LICENSE_KEY' \\
                        -e NEW_RELIC_APP_NAME='$REACT_NEW_RELIC_APP_NAME' \\
                        -p 3000:3000 \\
                        react-iot:latest
                '''
            }
        }

        stage('Cleanup Existing Python IOT Container') {
            when {
                expression { env.BUILD_PYTHON == 'true' }
            }
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
            when {
                expression { env.BUILD_PYTHON == 'true' }
            }
            steps {
                sh '''
                    docker run \\
                        --network iotnet \\
                        --restart unless-stopped \\
                        -d \\
                        --name python-sinric-device \\
                        -e APP_KEY='$PYTHON_APP_KEY' \\
                        -e APP_SECRET='$PYTHON_APP_SECRET' \\
                        -e SWITCH_ID='$PYTHON_SWITCH_ID' \\
                        -e URL='$PYTHON_SPRING_URL' \\
                        python-iot-device:latest
                '''
            }
        }
    }

    post {
        always {
            echo 'All sequential sub-pipelines completed.'
        }
    }
}
