node {
    stage('Checkout') {
        // Checkout the entire repository at workspace root
        git url: 'https://github.com/amits781/home_iot.git', branch: 'main'
    }

    stage('Stash Files') {
        // Stash subproject files separately
        stash includes: 'python_iot/**', name: 'python_iot_files'
        stash includes: 'react_app/**', name: 'react_app_files'
        stash includes: 'spring_boot_service/**', name: 'spring_boot_files'
    }

    parallel(
        'Python IoT': {
            node {
                unstash 'python_iot_files'      // Unstash files directly to workspace root
                load 'python_iot/Jenkinsfile'   // Load the sub-pipeline Jenkinsfile from relative path
            }
        },
        'React App': {
            node {
                unstash 'react_app_files'
                load 'react_app/Jenkinsfile'
            }
        },
        'Spring Boot Service': {
            node {
                unstash 'spring_boot_files'
                load 'spring_boot_service/Jenkinsfile'
            }
        }
    )

    echo 'All parallel sub-pipelines completed.'
}
