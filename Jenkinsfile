node {
    stage('Checkout') {
        git url: 'https://github.com/amits781/home_iot.git', branch: 'main'
    }
    
    parallel(
        'Python IoT': {
            dir('python_iot') {
                load 'Jenkinsfile'
            }
        }
        // 'React App': {
        //     load 'react_app/Jenkinsfile'
        // },
        // 'Spring Boot Service': {
        //     load 'spring_boot_service/Jenkinsfile'
        // }
    )
    echo 'All parallel sub-pipelines completed.'
}

