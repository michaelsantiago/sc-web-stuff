module.exports = function (grunt) {
	grunt.initConfig({
		properties : grunt.file.readJSON('properties.json'),
		pkg : grunt.file.readJSON('package.json'),
		'git-describe' : {
			options : {
				failOnError : true
			},
			deploy : {}
		},
		clean : {
			build : {
				src : ['<%= properties.deploymentTarget %>', '!<%= properties.deploymentTarget %>/data'],
				options : {
					force : true
				}
			},
			datastaticzips : {
				src : ['<%= properties.deploymentTarget %>/resources/datastatic/**/*.zip'],
				options : {
					force : true
				}
			}
		},
		copy : {
			website : {
				files : [{
						expand : true,
						cwd : 'bower_components/sc-client/',
						src : ['**', '!bower.json', '!README.md'],
						dest : '<%= properties.deploymentTarget %>/resources/'
					}, {
						expand : true,
						cwd : 'bower_components/<%= properties.company %>-sc-common/',
						src : ['**', '!bower.json', '!README.md', '!**/datastatic/**'],
						dest : '<%= properties.deploymentTarget %>/resources/'
					}, {
						expand : true,
						cwd : 'resources',
						src : ['**'],
						dest : '<%= properties.deploymentTarget %>/resources/'
					}, {
						expand : true,
						cwd : 'regions',
						src : ['**'],
						dest : '<%= properties.deploymentTarget %>'
					}
				]
			},
			full : {
				files : [{
						expand : true,
						cwd : 'bower_components/sc-client/',
						src : ['**', '!bower.json', '!README.md'],
						dest : '<%= properties.deploymentTarget %>/resources/'
					}, {
						expand : true,
						cwd : 'bower_components/<%= properties.company %>-sc-common/',
						src : ['**', '!bower.json', '!README.md'],
						dest : '<%= properties.deploymentTarget %>/resources/'
					}, {
						expand : true,
						cwd : 'resources',
						src : ['**'],
						dest : '<%= properties.deploymentTarget %>/resources/'
					}, {
						expand : true,
						cwd : 'regions',
						src : ['**'],
						dest : '<%= properties.deploymentTarget %>'
					}
				]
			},
			datastatic : {
				files : [{
						expand : true,
						cwd : 'bower_components/<%= properties.company %>-sc-common',
						src : ['**/datastatic/**'],
						dest : '<%= properties.deploymentTarget %>/resources/'
					}
				]
			}
		},
		concat : {
			options : {
				separator : ';'
			},
			mobile : {
				files : '<%= properties.filesToConcat %>'
			}
		},
		uglify : {
			desktop : {
				files : [{
						expand : true,
						src : ['**/*.js', '!**/datastatic/**'],
						dest : '<%= properties.deploymentTarget %>/resources',
						cwd : '<%= properties.deploymentTarget %>/resources'
					}
				]
			}
		},
		cssmin : {
			minify : {
				expand : true,
				src : '**/*.css',
				dest : '<%= properties.deploymentTarget %>/resources',
				cwd : '<%= properties.deploymentTarget %>/resources'
			}
		},
		htmlmin : {
			full : {
				options : {
					removeComments : true,
					collapseWhitespace : true,
					minifyJS : true,
					minifyCSS : true
				},
				files : [{
						expand : true,
						src : ['**/*.html'],
						dest : '<%= properties.deploymentTarget %>',
						cwd : '<%= properties.deploymentTarget %>'
					}
				]
			}
		},
		unzip : {
			datastatic : {
				src : '<%= properties.deploymentTarget %>/resources/datastatic/*.zip',
				dest : '<%= properties.deploymentTarget %>/resources/datastatic'
			}
		},
		aws_s3 : {
			options : {
				accessKeyId : '<%= properties.s3Key %>',
				secretAccessKey : '<%= properties.s3Secret %>',
				uploadConcurrency : 20,
				downloadConcurrency : 20,
				maxRetries : 5,
				gzip : true
			},
			dev_upload : {
				options : {
					bucket : '<%= properties.devBucket %>'
				},
				files : [{
						expand : true,
						cwd : '<%= properties.deploymentTarget %>',
						src : ['**'],
						stream : false,
						differential : true
					}
				]
			},
			test_upload : {
				options : {
					bucket : '<%= properties.testBucket %>'
				},
				files : [{
						expand : true,
						cwd : '<%= properties.deploymentTarget %>',
						src : ['**'],
						stream : false,
						differential : true
					}
				]
			},
			prod_upload : {
				options : {
					bucket : '<%= properties.prodBucket %>'
				},
				files : [{
						expand : true,
						cwd : '<%= properties.deploymentTarget %>',
						src : ['**'],
						stream : false,
						differential : true
					}
				]
			},
			dev_clean_full : {
				options : {
					bucket : '<%= properties.devBucket %>'
				},
				files : [{
						dest : '/',
						exclude : "resources/data/**",
						action : 'delete'
					}
				]
			},
			test_clean_full : {
				options : {
					bucket : '<%= properties.testBucket %>'
				},
				files : [{
						dest : '/',
						exclude : "resources/data/**",
						action : 'delete'
					}
				]
			},
			prod_clean_full : {
				options : {
					bucket : '<%= properties.prodBucket %>'
				},

				files : [{
						dest : '/',
						exclude : "resources/data/**",
						action : 'delete'
					}
				]
			},
			dev_clean_website : {
				options : {
					bucket : '<%= properties.devBucket %>'
				},
				files : [{
						dest : '/',
						exclude : ["resources/data/**", "resources/datastatic/**"],
						action : 'delete'
					}
				]
			},
			test_clean_website : {
				options : {
					bucket : '<%= properties.testBucket %>'
				},
				files : [{
						dest : '/',
						exclude : ["resources/data/**", "resources/datastatic/**"],
						action : 'delete'
					}
				]
			},
			prod_clean_website : {
				options : {
					bucket : '<%= properties.prodBucket %>'
				},
				files : [{
						dest : '/',
						exclude : ["resources/data/**", "resources/datastatic/**"],
						action : 'delete'
					}
				]
			},
			dev_clean_datastatic : {
				options : {
					bucket : '<%= properties.devBucket %>'
				},
				files : [{
						dest : 'resources/datastatic/',
						action : 'delete'
					}
				]
			},
			test_clean_datastatic : {
				options : {
					bucket : '<%= properties.testBucket %>'
				},
				files : [{
						dest : 'resources/datastatic/',
						action : 'delete'
					}
				]
			},
			prod_clean_datastatic : {
				options : {
					bucket : '<%= properties.prodBucket %>'
				},
				files : [{
						dest : 'resources/datastatic/',
						action : 'delete'
					}
				]
			}
		},
		prompt : {
			deploy : {
				options : {
					questions : [{
							config : 'deployType',
							type : 'list',
						default:
							'Website',
							choices : ['Website', 'Datastatic', 'Full', 'Upload Stage'],
							message : 'Please select a deploy type'
						}, {
							config : 'minify',
							type : 'list',
						default:
							'No',
							choices : ['Yes', 'No'],
							message : 'Minify CSS+JS+HTML?',
							when : function (answers) {
								if (['Upload Stage', 'Datastatic'].indexOf(answers['deployType']) === -1) {
									return true;
								}
							}
						}, {
							config : 'merge',
							type : 'list',
						default:
							'No',
							choices : ['Yes', 'No'],
							message : 'Merge CSS+JS?',
							when : function (answers) {
								if (['Upload Stage', 'Datastatic'].indexOf(answers['deployType']) === -1) {
									return true;
								}
							}
						}, {
							config : 'environment',
							type : 'list',
						default:
							'Local',
							choices : ['Local', 'Dev', 'Test', 'Prod'],
							message : 'Please select your deploy target'
						}, {
							config : 'confirm',
							type : 'list',
						default:
							'No',
							choices : ['Yes', 'No'],
							message : 'Would you like to continue?',
							when : function () {
								answers = arguments[0];
								console.log('\n\n***********************************************'.bold);
								console.log('Please review your configured DEPLOY options:\n');
								console.log('Deploy Type: ' + answers['deployType'].red.bold);
								if (['Upload Stage', 'Datastatic'].indexOf(answers['deployType']) === -1) {
									console.log('Minify CSS+JS+HTML: ' + answers['minify'].red.bold);
								}
								console.log('Environment: ' + answers['environment'].red.bold);
								if (answers['environment'] !== 'Local') {
									console.log('Bucket Name: ' + grunt.config.getRaw('properties.' + answers['environment'].toLowerCase() + 'Bucket').red.bold);
								}
								console.log('***********************************************'.bold);
								return true;
							}
						}
					],
					then : function () {
						var answers = arguments[0];
						var environment = answers['environment'].toLowerCase();
						if (answers['confirm'] === 'Yes') {

							var tasks = [];							
							if (answers['deployType'] === 'Upload Stage') {
								grunt.task.run('aws_s3:' + environment + '_upload');
								return true;
							} 
							
							tasks.push('clean:build');
							
							if (answers['deployType'] === 'Website') {
								tasks.push('copy:website');
							} else if (answers['deployType'] === 'Datastatic') {
								tasks.push('copy:datastatic');
								tasks.push('unzip', 'clean:datastaticzips');
							} else if (answers['deployType'] === 'Full') {
								tasks.push('copy:full');
								tasks.push('unzip', 'clean:datastaticzips');
							}

							if (answers['minify'] === 'Yes') {
								tasks.push('uglify', 'cssmin', 'htmlmin');
							}

							if (answers['merge'] === 'Yes') {
								tasks.push('concat');
							}

							/**Data upload for non-local target **/
							if (environment !== 'local') {
								tasks.push('aws_s3:' + environment + '_upload');
							}
							
							tasks.push('saveRevision');
							grunt.task.run(tasks);
							return true;
						}
					}
				}
			},
			clean : {
				options : {
					questions : [{
							config : 'cleanType',
							type : 'list',
						default:
							'Website',
							choices : ['Website', 'Datastatic', 'Full'],
							message : 'Please select a clean type'
						}, {
							config : 'environment',
							type : 'list',
						default:
							'Local',
							choices : ['Local', 'Dev', 'Test', 'Prod'],
							message : 'Please select your clean target'
						}, {
							config : 'confirm',
							type : 'list',
						default:
							'No',
							choices : ['Yes', 'No'],
							message : 'Would you like to continue?',
							when : function () {
								answers = arguments[0];
								console.log('\n\n***********************************************'.bold);
								console.log('Please review your configured CLEAN options:\n');
								console.log('Clean Type: ' + answers['cleanType'].red.bold);
								console.log('Environment: ' + answers['environment'].red.bold);
								if (answers['environment'] !== 'Local') {
									console.log('Bucket Name: ' + grunt.config.getRaw('properties.' + answers['environment'].toLowerCase() + 'Bucket').red.bold);
								}
								console.log('***********************************************'.bold);
								return true;
							}
						}
					],
					then : function () {
						var answers = arguments[0];
						var environment = answers['environment'].toLowerCase();
						if (answers['confirm'] === 'Yes') {
							var environment = answers['environment'].toLowerCase();
							var cleanType = answers['cleanType'].toLowerCase();
							grunt.task.run('aws_s3:' + environment + '_clean_' + cleanType);
						}
					}
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-prompt');
	grunt.loadNpmTasks('grunt-aws-s3-gzip');
	grunt.loadNpmTasks('grunt-git-describe');
	grunt.registerTask('deployMenu', ['prompt:deploy']);
	grunt.registerTask('cleanMenu', ['prompt:clean']);
	grunt.registerTask('saveRevision', 'Used to create JSON file with deployed version', function () {		
		grunt.event.once('git-describe', function (rev) {			
			var cleanDeploy = true;
			if(rev.dirty === '-dirty'){
				cleanDeploy = false;
			}						
			grunt.file.write(grunt.config.getRaw('properties.deploymentTarget') + '/version.json', JSON.stringify({
					version : grunt.config('pkg.version'),
					tag : rev.tag,
					revision : rev.object,
					clean : cleanDeploy, 
					date : grunt.template.today()					
				}));
		});
		grunt.task.run('git-describe');
	});
};
