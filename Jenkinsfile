node {
    stage('Checkout') {
        git url: 'https://github.com/amits781/home_iot.git', branch: 'main'
    }

    stage('Stash Files') {
        stash includes: 'python_iot/**', name: 'python_iot_files'
        stash includes: 'react_app/**', name: 'react_app_files'
        stash includes: 'spring_boot_service/**', name: 'spring_boot_files'
    }

    parallel(
        'Python IoT': {
            dir('python_iot') {
                unstash 'python_iot_files'
                load 'Jenkinsfile'
            }
        },
        'React App': {
            dir('react_app') {
                unstash 'react_app_files'
                load 'Jenkinsfile'
            }
        },
        'Spring Boot Service': {
            dir('spring_boot_service') {
                unstash 'spring_boot_files'
                load 'Jenkinsfile'
            }
        }
    )

    echo 'All parallel sub-pipelines completed.'
}
