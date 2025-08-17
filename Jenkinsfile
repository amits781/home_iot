node {
    stage('Checkout') {
        git url: 'https://github.com/amits781/home_iot.git', branch: 'main'
    }
    
    parallel(
        'Python IoT': {
            dir('python_iot') {
                load 'Jenkinsfile'
            }
        },
        'React App': {
            dir('react_app') {
                load 'Jenkinsfile'
            }
        },
        'Spring Boot Service': {
            dir('spring_boot_service') {
                load 'Jenkinsfile'
            }
        }
    )
    echo 'All parallel sub-pipelines completed.'
}

