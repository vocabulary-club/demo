package com.example.demo.service;

import com.example.demo.repository.MainRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class MainService {

    private final MainRepository mainRepository;

    public MainService(MainRepository mainRepository) {
        this.mainRepository = mainRepository;
    }

    public Object getVocDic() {

        return mainRepository.getVocDic();
    }

}
