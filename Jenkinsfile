node {
    stage('Checkout') {
        git url: 'https://github.com/amits781/home_iot.git', branch: 'main'
    }

    stage('Run Python IoT build') {
        load 'python_iot/Jenkinsfile'
    }

    stage('Run React App build') {
        load 'react_app/Jenkinsfile'
    }

    stage('Run Spring Boot Service build') {
        load 'spring_boot_service/Jenkinsfile'
    }

    stage('Cleanup Spring Boot App Existing Container') {
            sh '''
            existing_container=$(docker ps -aq -f name=iot_spring_boot)
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
            docker run --rm \\
                -d \\
                --network iotnet \\
                --name iot_spring_boot \\
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
                spring_boot_iot:latest
            """
        }
    }

    stage('Cleanup Existing React App Container') {
            sh '''
            existing_container=$(docker ps -aq -f name=iot_react)
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
            sh '''
             docker run --rm \\
                -d \\
                --network iotnet \\
                --name iot_react \\
                -e NEW_RELIC_LICENSE_KEY="${env.NEW_RELIC_LICENSE_KEY}" \\
                -e NEW_RELIC_APP_NAME="${env.NEW_RELIC_APP_NAME}" \\
                -p 3000:3000 \\
                react_iot:latest
            '''
        }
    }

    stage('Cleanup Existing Python IOT Container') {
        sh '''
        existing_container=$(docker ps -aq -f name=python_sinric_device)
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
            sh '''
            docker run --rm \\
                --network iotnet \\
                -d \\
                --name python_sinric_device \\
                -e APP_KEY="$APP_KEY" \\
                -e APP_SECRET="$APP_SECRET" \\
                -e SWITCH_ID="$SWITCH_ID" \\
                -e URL="$SPRING_URL" \\
                python-iot-device:latest
            '''
        }
    }

    echo 'All sequential sub-pipelines completed.'
}
