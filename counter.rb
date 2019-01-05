files = Dir.glob("js/*.js") + Dir.glob("src/*.js") +  Dir.glob("js/json/*.json")
cnt = [0, 0]
files.each do |filename|
  File.open(filename, 'r') do |file|
    while(line = file.gets)
      cnt[0], cnt[1] = *[cnt[0] + 1, cnt[1] + line.size]
    end
  end
end
puts cnt