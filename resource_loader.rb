#===================================================================
# Glob all images in assets/ and convert to js code in 'assets.js'
#===================================================================

resources = ["assets/*", "audio/BGM/*", "audio/SE/*"]
puts("\n------------------------------------\n")
resources.each do |path|
  files = Dir.glob(path)
  puts(path + "\n------------------------------------\n")
  files.each do |file|
    puts sprintf("'#{file}',\n")
  end
  puts("\n------------------------------------\n\n")
end