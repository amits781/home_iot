node {
    stage('Checkout') {
        git url: 'https://github.com/amits781/home_iot.git', branch: 'main'
    }

    stage('Run Python IoT pipeline') {
        load 'python_iot/Jenkinsfile'
    }

    stage('Run React App pipeline') {
        load 'react_app/Jenkinsfile'
    }

    stage('Run Spring Boot Service pipeline') {
        load 'spring_boot_service/Jenkinsfile'
    }

    echo 'All sequential sub-pipelines completed.'
}
