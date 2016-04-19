import tarfile
import sys
import os
import sys
import datetime

def isFloat(string):
    try:
        float(string)
        return True
    except ValueError:
        return False

def writelog(LDict, outfile):
	with open(outfile, "a") as f:
		for k,v in LDict.items():
			ln = v.split()
			#remove time elapsed before writing if starts with elapsed time
			if isFloat(ln[0]):
				ln = " ".join(ln[1::])
				f.write(ln)
				f.write("\n")
			else:
				ln = " ".join(ln[0::])
				f.write(ln)
				f.write("\n")

def ConvertBadgeLog(inlogfile, outlogfile):

	with open(inlogfile, "r") as infile:	
		LogDict = {} #Store all the lines in log, line number as key
		LineNum = 1 #Current Line number
		UpLineNum = 0 #Current Line number - 1	
		LastServerLineNum = 0 # track the line num of last UI: Server's Date & Time:
		LastCurrentLineNum = 0 # track the line num of last Current date and time:
		ServerStr = "UI: Server's Date & Time:"
		CurrentStr = "0.000 Current date and time:"
		BackVBLStr = "----------------- back in vbl -----------------"
		SectionMarker = "-----------"
		LastSectionMarkerLineNum = 0 # track the line num of last -----------
		CurrentSection = "-----------" # track section of log, ie vbl, badge, vcb
		TimeDelta = 0.000
		ServerTime = 0.000
		CurrTime = 0.000
		Datestr = "01/01/1970"
		SDateTime = datetime.datetime.now() #server's date and time each time we see ServerStr or CurrentStr
		CDateTime = datetime.datetime.now() #all other date and time lines added to SDateTime
		
		line = infile.readline()

		#read file into dict
		while(line):
			if line in ['\n', '\r\n']:
				pass
			else:
				key = LineNum
				LogDict[key] = line
				LineNum = LineNum + 1

			line = infile.readline()
		
		
		#look for times to convert
		for k,v in LogDict.iteritems():
			LineNum = k
			

			#find the line of each section in log
			if (SectionMarker) in v:
				line_lst = v.split()
				if line_lst[2] in ["vbl", "vcb", "badge", "updater"]:
					CurrentSection = line_lst[2]
					LastSectionMarkerLineNum = k
			

			if (CurrentStr) in v:
				if CurrentSection in ["vbl", "vcb", "badge", "updater"]:
					line_lst = v.split()
					DateStr = ' '.join(line_lst[-4:])
					ServerTime = float(line_lst[0])
					SDateTime = datetime.datetime.strptime(DateStr, "%b %d %H:%M:%S %Y")
					LogDict[k] = line_lst[0] + " " + datetime.datetime.strftime(SDateTime, "%m/%d/%y %H:%M:%S:%f")[:-3] + " " +' '.join(line_lst[1::])
				
					#need to go back up at this point to LastSectionMakerLineNum +1
					UpLineNum = k - 1

					while (UpLineNum > LastSectionMarkerLineNum-2):
						UpLineList = str(LogDict.get(UpLineNum))
						UpLineList = UpLineList.split()
						if isFloat(UpLineList[0]):
							CurrTime = float(UpLineList[0])
							TimeDelta =  ServerTime - CurrTime
							CDateTime = SDateTime - datetime.timedelta(seconds=TimeDelta)
							LogDict[UpLineNum] = UpLineList[0] + " " + datetime.datetime.strftime(CDateTime, "%m/%d/%y %H:%M:%S:%f")[:-3] + " " +' '.join(UpLineList[3::])
						else:
							#No time stamp to start line, just copy as is
							pass
						UpLineNum = UpLineNum - 1

				else:
					line_lst = v.split()
					if isFloat(line_lst[0]):
						CurrTime = float(line_lst[0])
						TimeDelta = CurrTime - ServerTime
						CDateTime = SDateTime + datetime.timedelta(seconds=TimeDelta)
						LogDict[k] = line_lst[0] + " " + datetime.datetime.strftime(CDateTime, "%m/%d/%y %H:%M:%S:%f")[:-3] + " " +' '.join(line_lst[1::])
					else:
						LogDict[k] = ' '.join(line_lst[0::])
						pass
				LastCurrentLineNum = k
				
			elif (ServerStr) in v:
				
				if LastServerLineNum < LastSectionMarkerLineNum: #checks to make sure it's the first occurrence of UI: Server's Date & Time

					line_lst = v.split()
					DateStr = ' '.join(line_lst[-4:])
					ServerTime = float(line_lst[0])
					SDateTime = datetime.datetime.strptime(DateStr, "%b %d %H:%M:%S %Y")
					LogDict[k] = line_lst[0] + " " + datetime.datetime.strftime(SDateTime, "%m/%d/%y %H:%M:%S:%f")[:-3] + " " +' '.join(line_lst[1::])
					LastServerLineNum = k
					
					#need to go back up at this point to LastSectionMakerLineNum +1
					UpLineNum = k - 1
					while (UpLineNum > LastSectionMarkerLineNum-2):
						UpLineList = str(LogDict.get(UpLineNum))
						UpLineList = UpLineList.split()
						if isFloat(UpLineList[0]):
							CurrTime = float(UpLineList[0])
							TimeDelta =  ServerTime - CurrTime
							CDateTime = SDateTime - datetime.timedelta(seconds=TimeDelta)
							LogDict[UpLineNum] = UpLineList[0] + " " + datetime.datetime.strftime(CDateTime, "%m/%d/%y %H:%M:%S:%f")[:-3] + " " +' '.join(UpLineList[3::])
						else:
							#No time stamp to start line, just copy as is
							pass
						UpLineNum = UpLineNum - 1
					
				else:
					line_lst = v.split()
					if isFloat(line_lst[0]):
						CurrTime = float(line_lst[0])
						TimeDelta = CurrTime - ServerTime
						CDateTime = SDateTime + datetime.timedelta(seconds=TimeDelta)
						LogDict[k] = line_lst[0] + " " + datetime.datetime.strftime(CDateTime, "%m/%d/%y %H:%M:%S:%f")[:-3] + " " +' '.join(line_lst[1::])
					else:
						LogDict[k] = ' '.join(line_lst[0::])
						pass
						
			else:

				line_lst = v.split()
				if isFloat(line_lst[0]):
					CurrTime = float(line_lst[0])
					TimeDelta = CurrTime - ServerTime
					CDateTime = SDateTime + datetime.timedelta(seconds=TimeDelta)
					LogDict[k] = line_lst[0] + " " + datetime.datetime.strftime(CDateTime, "%m/%d/%y %H:%M:%S:%f")[:-3] + " " +' '.join(line_lst[1::])
				else:
					LogDict[k] = ' '.join(line_lst[0::])
					pass

	#corner case when log starts with back in vbl not 0.000
	#9160.993 ----------------- back in vbl -----------------
    #9160.994 Current date and time: Wed Feb 19 16:55:31 2014
	#we'll delete these lines
	if BackVBLStr in LogDict[1]:
		del LogDict[1]
		del LogDict[2]

	#write converted log
	writelog(LogDict, outlogfile)


#loop through all tar files and extract logs in given path
for (dirpath, dirname, filenames) in os.walk(sys.argv[1]):
	for f in filenames:
		if f.lower() in "log.txt":
			mylog = "log.txt"
			outlog = "Converted-log.txt"
			ConvertBadgeLog(mylog, outlog)
		if f.lower() in "log.txt.old":
			mylog = "log.txt.old"
			outlog = "Converted-log.txt.old"
			ConvertBadgeLog(mylog, outlog)
		if f.endswith(".gz"):
			fn = f.split(".")
			fn = fn[0]
			if not os.path.exists(fn):
				os.makedirs(fn)
			tar = tarfile.open(f, "r")
			try:
				tar.extract("log.txt", fn)
				mylog = fn + "\log.txt"
				outlog = fn + "\\" + fn + "-log.txt"
				print "Converting %s" %fn + " log.txt"
				ConvertBadgeLog(mylog, outlog)

			except KeyError:
				print "Did not find log.txt in %s" %fn
				pass

			try:
				tar.extract("log.txt.old", fn)
				mylog = fn + "\log.txt.old"
				outlog = fn + "\\" + fn + "-log.txt.old"
				print "Converting %s" %fn + " log.txt.old"
				ConvertBadgeLog(mylog, outlog)

			except KeyError:
				print "Did not find log.txt.old in %s" %fn