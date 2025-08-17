node {

    // Declare boolean flags
    boolean buildPython = true
    boolean buildReact = true
    boolean buildSpring = true

    stage('Checkout') {
        git url: 'https://github.com/amits781/home_iot.git', branch: 'main'
    }


    if(buildPython) {
        stage('Python - Generate newrelic.ini') {
            dir('python_iot') {
                withCredentials([string(credentialsId: 'PYTHON_NEW_RELIC_KEY_CRED', variable: 'NEW_RELIC_KEY')]) {
                    sh '''
                    export PYTHON_NEW_RELIC_LICENSE_KEY="$NEW_RELIC_KEY"
                    envsubst < newrelic_template.ini > newrelic.ini
                    '''
                }
            }
        }
    

        stage('Python - Build Docker Image') {
            dir('python_iot') {
                dockerImage = docker.build("python-iot-device:latest", "--no-cache .")
            }
        }
    }

    if(buildReact) {
        stage('React - Build Docker Image') {
            dir('react_app') {
                    script {
                        withCredentials([
                            string(credentialsId: 'REACT_APP_PIXBAY_KEY', variable: 'REACT_APP_PIXBAY_KEY'),
                            string(credentialsId: 'REACT_APP_CLERK_PUBLISHABLE_KEY', variable: 'REACT_APP_CLERK_PUBLISHABLE_KEY'),
                            string(credentialsId: 'REACT_APP_HOST_URL', variable: 'REACT_APP_HOST_URL')
                        ]) {
                            def buildArgs = "--build-arg REACT_APP_PIXBAY_KEY=${env.REACT_APP_PIXBAY_KEY} " +
                                            "--build-arg REACT_APP_CLERK_PUBLISHABLE_KEY=${env.REACT_APP_CLERK_PUBLISHABLE_KEY} " +
                                            "--build-arg REACT_APP_HOST_URL=${env.REACT_APP_HOST_URL} ."
                            dockerImage = docker.build("react-iot:latest", buildArgs)
                        }
                    }
            }
        }
    }

    if(buildSpring) {
        stage('Spring - Generate newrelic.yml') {
            dir('spring_boot_service/newrelic') {
                withCredentials([string(credentialsId: 'SPRING_APP_NEW_RELIC_KEY', variable: 'NEW_RELIC_KEY')]) {
                    sh '''
                    export NEW_RELIC_LICENSE_KEY="$NEW_RELIC_KEY"
                    envsubst < newrelic_template.yml > newrelic.yml
                    '''
                }
            }
        }

        stage('Spring - Build Docker Image') {
            dir('spring_boot_service') {
                script {
                    dockerImage = docker.build("spring-boot-iot:latest", "--no-cache .")
                }
            }
        }

        stage('Cleanup Spring Boot App Existing Container') {
                sh '''
                existing_container=$(docker ps -aq -f name=iot-spring-boot)
                if [ ! -z "$existing_container" ]; then
                    docker rm -f $existing_container
                fi
                '''
        }

        stage('Run Spring Boot Docker Container') {
                withCredentials([
                string(credentialsId: 'SPRING_APP_ISS_URI', variable: 'ISS_URI'),
                string(credentialsId: 'SPRING_APP_JWK_URI', variable: 'JWK_URI'),
                string(credentialsId: 'SPRING_APP_DATABASE', variable: 'DATABASE'),
                string(credentialsId: 'SPRING_APP_DB_USER', variable: 'DB_USER'),
                string(credentialsId: 'SPRING_APP_DB_PASSWORD', variable: 'DB_PASSWORD'),
                string(credentialsId: 'SPRING_APP_EMAIL_PASSWORD', variable: 'EMAIL_PASSWORD'),
                string(credentialsId: 'SPRING_APP_SENDER_EMAIL_ID', variable: 'SENDER_EMAIL'),
                string(credentialsId: 'SPRING_APP_SECRET_KEY', variable: 'SECRET_KEY'),
                string(credentialsId: 'SPRING_APP_MYSQL_HOST', variable: 'MYSQL_HOST'),
                string(credentialsId: 'SPRING_APP_MYSQL_PORT', variable: 'MYSQL_PORT')
            ]) {
                sh """
                docker run \\
                    -d \\
                    --network iotnet \\
                    --name iot-spring-boot \\
                    --restart unless-stopped \\
                    -e ISS_URI="${env.ISS_URI}" \\
                    -e JWK_URI="${env.JWK_URI}" \\
                    -e MYSQL_HOST="${env.MYSQL_HOST}" \\
                    -e MYSQL_PORT="${env.MYSQL_PORT}" \\
                    -e DATABASE="${env.DATABASE}" \\
                    -e DB_USER="${env.DB_USER}" \\
                    -e DB_PASSWORD="${env.DB_PASSWORD}" \\
                    -e EMAIL_PASSWORD="${env.EMAIL_PASSWORD}" \\
                    -e SENDER_EMAIL="${env.SENDER_EMAIL}" \\
                    -e SECRET_KEY="${env.SECRET_KEY}" \\
                    -p 8080:8080 \\
                    spring-boot-iot:latest
                """
            }
        }
    }

    if(buildReact) {
        stage('Cleanup Existing React App Container') {
                sh '''
                existing_container=$(docker ps -aq -f name=iot-react)
                if [ ! -z "$existing_container" ]; then
                    docker rm -f $existing_container
                fi
                '''
        }

        stage('Run React App Docker Container') {
            withCredentials([
                string(credentialsId: 'REACT_APP_NEW_RELIC_LICENSE_KEY', variable: 'NEW_RELIC_LICENSE_KEY'),
                string(credentialsId: 'REACT_APP_NEW_RELIC_APP_NAME', variable: 'NEW_RELIC_APP_NAME')
            ]) {
                sh """
                docker run \\
                    -d \\
                    --restart unless-stopped \\
                    --network iotnet \\
                    --name iot-react \\
                    -e NEW_RELIC_LICENSE_KEY="${env.NEW_RELIC_LICENSE_KEY}" \\
                    -e NEW_RELIC_APP_NAME="${env.NEW_RELIC_APP_NAME}" \\
                    -p 3000:3000 \\
                    react-iot:latest
                """
            }
        }
    }

    if(buildPython) {
        stage('Cleanup Existing Python IOT Container') {
            sh '''
            existing_container=$(docker ps -aq -f name=python-sinric-device)
            if [ ! -z "$existing_container" ]; then
                docker rm -f $existing_container
            fi
            '''
        }

        stage('Run Python IOT Docker Container') {
            withCredentials([
                string(credentialsId: 'PYTHON_APP_KEY', variable: 'APP_KEY'),
                string(credentialsId: 'PYTHON_APP_SECRET', variable: 'APP_SECRET'),
                string(credentialsId: 'PYTHON_SWITCH_ID', variable: 'SWITCH_ID'),
                string(credentialsId: 'PYTHON_SPRING_URL', variable: 'SPRING_URL')
            ]) {
                sh """
                docker run \\
                    --network iotnet \\
                    --restart unless-stopped \\
                    -d \\
                    --name python-sinric-device \\
                    -e APP_KEY="${env.APP_KEY}" \\
                    -e APP_SECRET="${env.APP_SECRET}" \\
                    -e SWITCH_ID="${env.SWITCH_ID}" \\
                    -e URL="${env.SPRING_URL}" \\
                    python-iot-device:latest
                """
            }
        }
    }

    echo 'All sequential sub-pipelines completed.'
}
