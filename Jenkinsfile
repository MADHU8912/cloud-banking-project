pipeline {
    agent any

    environment {
        IMAGE_NAME = "nikhilabba12/cloud-banking"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git 'https://github.com/MADHU8912/cloud-banking-project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t %IMAGE_NAME% .'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
                }
            }
        }

        stage('Docker Push') {
            steps {
                bat 'docker push %IMAGE_NAME%'
            }
        }

        stage('Deploy Container') {
            steps {
                bat '''
                docker stop banking-container || exit 0
                docker rm banking-container || exit 0

                docker run -d -p 5005:5000 --name banking-container %IMAGE_NAME%
                '''
            }
        }
    }
}